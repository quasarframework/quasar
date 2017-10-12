const version = process.env.VERSION || require('../package.json').version

module.exports = {
  version,
  themes: ['mat', 'ios'],
  themeToken: '__THEME__',
  banner:
    '/*!\n' +
    ' * Quasar Framework v' + version + '\n' +
    ' * (c) 2016-present Razvan Stoenescu\n' +
    ' * Released under the MIT License.\n' +
    ' */'
}
