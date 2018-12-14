const ExtractLoader = require('mini-css-extract-plugin').loader

const
  appPaths = require('../app-paths'),
  postCssConfig = require(appPaths.resolve.app('.postcssrc.js'))

function injectRule ({ chain, pref }, lang, test, loader, options) {
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
      importLoaders: 2 + (loader ? 1 : 0),
      sourceMap: pref.sourceMap
    }

    if (modules) {
      Object.assign(cssLoaderOptions, {
        modules,
        localIdentName: '[name]_[local]_[hash:base64:5]'
      })
    }

    rule.use('css-loader')
      .loader('css-loader')
      .options(cssLoaderOptions)

    const
      postCssOpts = Object.assign({ sourceMap: pref.sourceMap }, postCssConfig),
      rtlOptions = pref.rtl === true ? {} : pref.rtl

    if (pref.rtl || pref.minify) {
      pref.rtl && postCssOpts.plugins.push(
        require('postcss-rtl')(rtlOptions)
      )
      pref.minify && postCssOpts.plugins.push(
        require('cssnano')
      )
    }

    rule.use('postcss-loader')
      .loader('postcss-loader')
      .options(postCssOpts)

    if (loader) {
      rule.use(loader)
        .loader(loader)
        .options(Object.assign(
          { sourceMap: pref.sourceMap },
          options
        ))
    }
  }
}

module.exports = function (chain, options) {
  const meta = {
    chain,
    pref: options
  }

  injectRule(meta, 'css', /\.css$/)
  injectRule(meta, 'stylus', /\.styl(us)?$/, 'stylus-loader', {
    preferPathResolver: 'webpack'
  })
  injectRule(meta, 'scss', /\.scss$/, 'sass-loader')
  injectRule(meta, 'sass', /\.sass$/, 'sass-loader', {
    indentedSyntax: true
  })
  injectRule(meta, 'less', /\.less$/, 'less-loader')
}
