
const { bold } = require('chalk')
const { removeFileLoaders } = require('../utils')
const nodePackager = require('../../node-packager')

const depRE = /Can't resolve '(.*)' in/
const relativeRE = /^(\.\/|\.\.\/)/
const cmd = nodePackager === 'yarn'
  ? 'yarn add'
  : 'npm install --save'

module.exports = function format (error, printLog, titleFn) {
  const dependency = error.message.match(depRE)[1]

  printLog(titleFn(removeFileLoaders(error.file)))
  printLog()
  printLog(`Module not found: Can't resolve imported dependency "${bold.underline.yellow(dependency)}"`)

  if (relativeRE.test(dependency) === false) {
    printLog(`Did you forget to install it? You can run: ${bold(`${cmd} ${dependency}`)}`)
  }
}
