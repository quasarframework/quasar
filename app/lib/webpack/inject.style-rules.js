const ExtractLoader = require('mini-css-extract-plugin').loader
const { merge } = require('webpack-merge')
const path = require('path')

const appPaths = require('../app-paths')
const cssVariables = require('../helpers/css-variables')
const postCssConfigFile = appPaths.resolve.app('.postcssrc.js')
const quasarCssPaths = [
  path.join('node_modules', 'quasar', 'dist'),
  path.join('node_modules', 'quasar', 'src'),
  path.join('node_modules', '@quasar')
]

const absoluteUrlRE = /^[a-z][a-z0-9+.-]*:/i
const protocolRelativeRE = /^\/\//
const templateUrlRE = /^[{}[\]#*;,'§$%&(=?`´^°<>]/
const rootRelativeUrlRE = /^\//

/**
 * Inspired by loader-utils > isUrlRequest()
 * Mimics Webpack v4 & css-loader v3 behavior
 */
function shouldRequireUrl (url) {
  return (
    // an absolute url and it is not `windows` path like `C:\dir\file`:
    (absoluteUrlRE.test(url) === true && path.win32.isAbsolute(url) === false)
    // a protocol-relative:
    || protocolRelativeRE.test(url) === true
    // some kind of url for a template:
    || templateUrlRE.test(url) === true
    // not a request if root isn't set and it's a root-relative url
    || rootRelativeUrlRE.test(url) === true
  ) === false
}

function injectRule (chain, pref, lang, test, loader, loaderOptions) {
  const baseRule = chain.module.rule(lang).test(test)

  // rules for <style lang="module">
  const modulesRule = baseRule.oneOf('modules-query').resourceQuery(/module/)
  create(modulesRule, true)

  // rules for *.module.* files
  const modulesExtRule = baseRule.oneOf('modules-ext').test(/\.module\.\w+$/)
  create(modulesExtRule, true)

  const normalRule = baseRule.oneOf('normal')
  create(normalRule, false)

  function create (rule, modules) {
    if (pref.isServerBuild === true) {
      rule.use('null-loader')
        .loader('null-loader')
      return
    }

    if (pref.extract) {
      rule.use('mini-css-extract')
        .loader(ExtractLoader)
        .options({ publicPath: '../' })
    }
    else {
      rule.use('vue-style-loader')
        .loader('vue-style-loader')
        .options({
          sourceMap: pref.sourceMap
        })
    }

    const cssLoaderOptions = {
      sourceMap: pref.sourceMap,
      url: shouldRequireUrl,
      importLoaders:
        1 + // stylePostLoader injected by vue-loader
        1 + // postCSS loader
        (!pref.extract && pref.minify ? 1 : 0) + // postCSS with cssnano
        (loader ? (loader === 'sass-loader' ? 2 : 1) : 0)
    }

    if (modules) {
      Object.assign(cssLoaderOptions, {
        modules: {
          localIdentName: '[name]_[local]_[hash:base64:5]'
        }
      })
    }

    rule.use('css-loader')
      .loader('css-loader')
      .options(cssLoaderOptions)

    if (!pref.extract && pref.minify) {
      // needs to be applied separately,
      // otherwise it messes up RTL
      rule.use('cssnano')
        .loader('postcss-loader')
        .options({
          sourceMap: pref.sourceMap,
          postcssOptions: {
            plugins: [
              require('cssnano')({
                preset: [ 'default', {
                  mergeLonghand: false,
                  convertValues: false,
                  cssDeclarationSorter: false,
                  reduceTransforms: false
                } ]
              })
            ]
          }
        })
    }

    // need a fresh copy, otherwise plugins
    // will keep on adding making N duplicates for each one
    delete require.cache[postCssConfigFile]
    const postCssConfig = require(postCssConfigFile)
    let postCssOpts = { sourceMap: pref.sourceMap, ...postCssConfig }

    if (pref.rtl) {
      const postcssRTL = require('postcss-rtlcss')
      const postcssRTLOptions = pref.rtl === true ? {} : pref.rtl

      if (
        typeof postCssConfig.plugins !== 'function' &&
        (postcssRTLOptions.source === 'ltr' || typeof postcssRTLOptions === 'function')
      ) {
        const originalPlugins = postCssOpts.plugins ? [ ...postCssOpts.plugins ] : []

        postCssOpts = ctx => {
          const plugins = [ ...originalPlugins ]
          const isClientCSS = quasarCssPaths.every(item => ctx.resourcePath.indexOf(item) === -1)

          plugins.push(postcssRTL(
            typeof postcssRTLOptions === 'function'
              ? postcssRTLOptions(isClientCSS, ctx.resourcePath)
              : {
                ...postcssRTLOptions,
                source: isClientCSS ? 'rtl' : 'ltr'
              }
          ))

          return { sourceMap: pref.sourceMap, plugins }
        }
      }
      else {
        postCssOpts.plugins.push(postcssRTL(postcssRTLOptions))
      }
    }

    rule.use('postcss-loader')
      .loader('postcss-loader')
      .options({ postcssOptions: postCssOpts })

    if (loader) {
      rule.use(loader)
        .loader(loader)
        .options({
          sourceMap: pref.sourceMap,
          ...loaderOptions
        })

      if (loader === 'sass-loader') {
        if (loaderOptions && loaderOptions.sassOptions && loaderOptions.sassOptions.indentedSyntax) {
          rule.use('quasar-sass-variables-loader')
            .loader(cssVariables.loaders.sass)
        }
        else {
          rule.use('quasar-scss-variables-loader')
            .loader(cssVariables.loaders.scss)
        }
      }
    }
  }
}

module.exports = function (chain, pref) {
  injectRule(chain, pref, 'css', /\.css$/)
  injectRule(chain, pref, 'stylus', /\.styl(us)?$/, 'stylus-loader', {
    preferPathResolver: 'webpack',
    ...pref.stylusLoaderOptions
  })
  injectRule(chain, pref, 'scss', /\.scss$/, 'sass-loader', merge(
    { sassOptions: { outputStyle: /* required for RTL */ 'expanded' } },
    pref.scssLoaderOptions
  ))
  injectRule(chain, pref, 'sass', /\.sass$/, 'sass-loader', merge(
    { sassOptions: { indentedSyntax: true, outputStyle: /* required for RTL */ 'expanded' } },
    pref.sassLoaderOptions
  ))
  injectRule(chain, pref, 'less', /\.less$/, 'less-loader', pref.lessLoaderOptions)
}
