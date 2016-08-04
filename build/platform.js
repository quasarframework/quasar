var theme = process.argv[2] || 'mat'

module.exports = {
  theme: theme,
  cordovaAssets: './cordova/platforms/' + (theme === 'mat' ? 'android' : 'ios') + '/platform_www'
}
