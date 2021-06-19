
const { removeFileLoaders } = require('../utils')

module.exports = function format (error, printLog, titleFn) {
  printLog(titleFn(removeFileLoaders(error.file)))
  printLog()
  printLog(error.message)
}
