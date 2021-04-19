
const { yellow } = require('chalk')

const tips = 'You may use special comments to disable some warnings.'
  + '\nUse ' + yellow('// eslint-disable-next-line') + ' to ignore the next line.'
  + '\nUse ' + yellow('/* eslint-disable */') + ' to ignore all warnings in a file.\n'

module.exports = function format (error, printLog, titleFn) {
  printLog(titleFn('Reported by ESLint:'))
  printLog(error.message)
  printLog(tips)
}
