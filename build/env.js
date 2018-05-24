const { resolve } = require('path')
const
  theme = process.argv[2] || 'mat',
  host = process.env.HOST || 'localhost',
  port = process.env.PORT || 8080

module.exports = {
  theme,
  quasarVersion: require('../package.json').version,
  host,
  port,
  devServerConfig: {
    publicPath: '/',
    host,
    port,
    hot: true,
    inline: true,
    overlay: true,
    quiet: true,
    historyApiFallback: true,
    noInfo: true,
    disableHostCheck: true,
    contentBase: [
      resolve(__dirname, '../dev')
    ]
  }
}
