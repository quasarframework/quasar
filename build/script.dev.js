process.env.NODE_ENV = 'development'

var
  path = require('path'),
  express = require('express'),
  webpack = require('webpack'),
  webpackConfig = require('./webpack.config'),
  env = require('./env-utils'),
  app = express(),
  opn = require('opn'),
  port = process.env.PORT || 8080,
  compiler = webpack(webpackConfig),
  devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  }),
  hotMiddleware = require('webpack-hot-middleware')(compiler)

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticsPath = path.posix.join(webpackConfig.output.publicPath, 'statics/')
app.use(staticsPath, express.static('./dev/statics'))

// try to serve Cordova statics for Play App
app.use(express.static(env.platform.cordovaAssets))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port

  console.log('Developing with "' + env.platform.theme + '" theme')
  console.log('Listening at ' + uri + '\n')
  console.log('Building. Please wait...')
  console.log('Browser will open momentarily.\n')

  devMiddleware.waitUntilValid(function () {
    opn(uri)
  })
})
