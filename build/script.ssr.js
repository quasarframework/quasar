var
  webpack = require('webpack'),
  webpackSSRConfig = require('./webpack.ssr.conf')

// Compile SSR
module.exports = function renderSSRFile (overrideOptions) {

  const config = Object.assign(
    {}, webpackSSRConfig, overrideOptions
  )

  webpack(config, function (err, stats) {
    if (err) throw err

    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')

    if (stats.hasErrors()) {
      process.exit(1)
    }
  })
}
