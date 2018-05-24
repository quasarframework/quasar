const { resolve } = require('path')
const theme = process.argv[2] || 'mat'

module.exports = {
  theme,
  quasarVersion: require('../package.json').version,
  devServerConfig: {
    publicPath: '/',
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
