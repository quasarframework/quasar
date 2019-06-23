const ExtractLoader = require('mini-css-extract-plugin').loader

const
  { join } = require('path'),
  appPaths = require('../app-paths'),
  postCssConfig = require(appPaths.resolve.app('.postcssrc.js'))

const QuasarStylusVariablesLoader = join(__dirname, 'loader.quasar-stylus-variables')

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
      importLoaders:
        1 + // stylePostLoader injected by vue-loader
        1 + // postCSS loader
        (!pref.extract && pref.minify ? 1 : 0) + // postCSS with cssnano
        (loader ? (loader === 'stylus-loader' ? 2 : 1) : 0),
      sourceMap: pref.sourceMap
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
              preset: ['default', {
                mergeLonghand: false,
                convertValues: false,
                cssDeclarationSorter: false,
                reduceTransforms: false
              }]
            })
          ]
        })
    }

    const postCssOpts = { sourceMap: pref.sourceMap, ...postCssConfig }

    pref.rtl && postCssOpts.plugins.push(
      require('postcss-rtl')(pref.rtl === true ? {} : pref.rtl)
    )

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
          .loader(QuasarStylusVariablesLoader)
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
  injectRule(chain, pref, 'scss', /\.scss$/, 'sass-loader', pref.scssLoaderOptions)
  injectRule(chain, pref, 'sass', /\.sass$/, 'sass-loader', {
    indentedSyntax: true,
    ...pref.sassLoaderOptions
  })
  injectRule(chain, pref, 'less', /\.less$/, 'less-loader', pref.lessLoaderOptions)
}
