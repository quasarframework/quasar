const { removeFileLoaders } = require('../utils.js')

module.exports = function format (error, printLog, titleFn) {
  printLog(titleFn(removeFileLoaders(error.file)))
  printLog()
  printLog(error.message)
}
