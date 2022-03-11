const { name, author, version } = require('../package.json')
const year = (new Date()).getFullYear()

module.exports = {
  name,
  version,
  banner:
    '/*!\n' +
    ' * ' + name + ' v' + version + '\n' +
    ' * (c) ' + year + ' ' + author + '\n' +
    ' * Released under the MIT License.\n' +
    ' */\n'
}
