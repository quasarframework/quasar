const ExtractLoader = require('mini-css-extract-plugin').loader
const merge = require('webpack-merge')
const path = require('path')

const appPaths = require('../app-paths')
const cssVariables = require('../helpers/css-variables')
const postCssConfigFile = appPaths.resolve.app('.postcssrc.js')

const quasarCssPaths = [ path.join('node_modules', 'quasar'), path.join('node_modules', '@quasar') ]

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
    if (pref.serverExtract !== true) {
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
    }

    const cssLoaderOptions = {
      sourceMap: pref.sourceMap,
      onlyLocals: pref.serverExtract,
      importLoaders:
        (pref.serverExtract ? 0 : 1) + // stylePostLoader injected by vue-loader
        1 + // postCSS loader
        (!pref.extract && pref.minify ? 1 : 0) + // postCSS with cssnano
        (loader ? (loader === 'stylus-loader' || loader === 'sass-loader' ? 2 : 1) : 0)
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
        })
    }

    // need a fresh copy, otherwise plugins
    // will keep on adding making N duplicates for each one
    delete require.cache[postCssConfigFile]
    const postCssConfig = require(postCssConfigFile)
    const postCssOpts = { sourceMap: pref.sourceMap, ...postCssConfig }

    if (pref.rtl) {
      const postcssRTL = require('postcss-rtl')
      const postcssRTLOptions = pref.rtl === true ? {} : pref.rtl

      if (
        typeof postCssConfig.plugins !== 'function' &&
        (postcssRTLOptions.fromRTL === true || typeof postcssRTLOptions === 'function')
      ) {
        postCssConfig.plugins = postCssConfig.plugins || []

        postCssOpts.plugins = ctx => {
          const plugins = [ ...postCssConfig.plugins ]
          const isClientCSS = quasarCssPaths.every(item => ctx.resourcePath.indexOf(item) === -1)

          plugins.push(postcssRTL(
            typeof postcssRTLOptions === 'function'
              ? postcssRTLOptions(isClientCSS, ctx.resourcePath)
              : {
                ...postcssRTLOptions,
                fromRTL: isClientCSS
              }
          ))

          return plugins
        }
      }
      else {
        postCssOpts.plugins.push(postcssRTL(postcssRTLOptions))
      }
    }

    rule.use('postcss-loader')
      .loader('postcss-loader')
      .options(postCssOpts)

    if (loader) {
      rule.use(loader)
        .loader(loader)
        .options({
          sourceMap: pref.sourceMap,
          ...loaderOptions
        })

      if (loader === 'stylus-loader') {
        rule.use('quasar-stylus-variables-loader')
          .loader(cssVariables.loaders.styl)
      }
      else if (loader === 'sass-loader') {
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
