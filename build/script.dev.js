if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

require('colors')

var
  path = require('path'),
  express = require('express'),
  webpack = require('webpack'),
  env = require('./env-utils'),
  opn = require('opn'),
  webpackConfig = require('./webpack.config'),
  app = express(),
  port = process.env.PORT || 8080,
  uri = 'http://' + (process.env.HOST || 'localhost') + ':' + port

console.log(' Starting dev server with "' + (process.argv[2] || env.platform.theme).bold + '" theme...')
console.log(' Will listen at ' + uri.bold)
console.log(' Browser will open when build is ready.\n')

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  logLevel: 'silent'
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: function () {}
})

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
    process.exit(1)
  }

  devMiddleware.waitUntilValid(function () {
    opn(uri)
  })
})
