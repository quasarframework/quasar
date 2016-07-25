process.env.BABEL_ENV = 'development'

var
  express = require('express'),
  webpack = require('webpack'),
  webpackConfig = require('./webpack.dev.config'),
  app = express(),
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

module.exports = app.listen(8080, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Developing with "' + (process.argv[2] || 'mat') + '" theme')
  console.log('Listening at http://localhost:8080\n')
})
