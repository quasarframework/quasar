process.env.BABEL_ENV = 'development'

var
  express = require('express'),
  webpack = require('webpack'),
  webpackConfig = require('./webpack.dev.config'),
  platform = require('./platform'),
  app = express(),
  port = process.env.PORT || 8080,
  compiler = webpack(webpackConfig),
  devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: '',
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
app.use('/statics', express.static('./dev/statics'))

// try to serve Cordova statics for Play App
app.use(express.static(platform.cordovaAssets))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Developing with "' + platform.theme + '" theme')
  console.log('Listening at http://localhost:' + port + '\n')
})
