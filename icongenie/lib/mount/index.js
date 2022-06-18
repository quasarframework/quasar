const { mountCordova, isCordovaFile, verifyCordova } = require('./mount-cordova')
const { mountTag } = require('./mount-tag')

module.exports.mount = function mount (files) {
  mountCordova(files)
  mountTag(files)
}

module.exports.verifyMount = function verifyMount (file) {
  return isCordovaFile(file)
    ? verifyCordova(file)
    : ''
}
