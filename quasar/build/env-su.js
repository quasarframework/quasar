const
  host = process.env.HOST || '0.0.0.0',
  port = process.env.PORT || (process.env.QUASAR_SSR ? 8554 : 8080)

module.exports = {
  quasarVersion: require('../package.json').version,
  host,
  port,
  uri: `http://${host}:${port}`,
  rtl: false, //process.env.QUASAR_RTL !== void 0,
  devServerConfig: {
    publicPath: '/',
    host,
    port,
    stats: 'none',
    hot: true,
    inline: true,
    overlay: true,
    quiet: true,
    historyApiFallback: true,
    noInfo: true,
    disableHostCheck: true,
    contentBase: [
      require('path').resolve(__dirname, '../dev')
    ]
  }
}
