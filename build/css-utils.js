module.exports.postCSSrc = require('../.postcssrc')

module.exports.cssLoaders = function (options = {}) {
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: true
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: true
    }
  }

  if (options.rtl) {
    postcssLoader.options.plugins = () => {
      return module.exports.postCSSrc.plugins.concat([
        require('postcss-rtl')()
      ])
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader) {
    const loaders = options.postCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: {
          sourceMap: true
        }
      })
    }

    return ['vue-style-loader'].concat(loaders)
  }

  const stylusLoader = generateLoaders('stylus')

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    stylus: stylusLoader,
    styl: stylusLoader
  }
}

// Generate loaders for standalone style files (outside of .vue)
module.exports.styleLoaders = function (options) {
  const
    output = [],
    loaders = module.exports.cssLoaders(options)

  for (let extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}
