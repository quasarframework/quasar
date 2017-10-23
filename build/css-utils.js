var
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  autoprefixer = require('autoprefixer')

module.exports.postcss = [autoprefixer()]

module.exports.styleLoaders = function (options) {
  options = options || {}

  function generateLoaders (loaders) {
    if (options.postcss) {
      loaders.splice(1, 0, 'postcss')
    }

    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      }
      else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: sourceLoader,
        fallback: 'vue-style-loader'
      })
    }
    else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  return {
    css: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    styl: generateLoaders(['css', 'stylus']),
    stylus: generateLoaders(['css', 'stylus'])
  }
}

module.exports.styleRules = function (options) {
  var output = []
  var loaders = exports.styleLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}
