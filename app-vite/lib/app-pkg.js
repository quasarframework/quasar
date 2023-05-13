
const { getPackageJson } = require('./utils/get-package-json.js')

const appPaths = require('./app-paths.js')

const cliPkg = require('../package.json')
const appPkg = require(appPaths.resolve.app('package.json'))
const quasarPkg = getPackageJson('quasar')
const vitePkg = getPackageJson('vite')

module.exports.cliPkg = cliPkg
module.exports.appPkg = appPkg
module.exports.quasarPkg = quasarPkg
module.exports.vitePkg = vitePkg
