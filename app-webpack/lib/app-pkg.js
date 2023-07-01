const { readFileSync } = require('node:fs')

const { getPackageJson } = require('./utils/get-package-json.js')
const appPaths = require('./app-paths.js')

const appPkgPath = appPaths.resolve.app('package.json')
const appPkg = readAppPackageJson()

function readAppPackageJson () {
  return JSON.parse(
    readFileSync(appPkgPath, 'utf-8')
  )
}

module.exports.cliPkg = require('../package.json')
module.exports.quasarPkg = getPackageJson('quasar')

module.exports.updateAppPackageJson = function updateAppPackageJson () {
  // we need to keep the appPkg reference,
  // so we "empty" the object and then assign all the new values

  for (const key in appPkg) {
    delete appPkg[ key ]
  }

  Object.assign(appPkg, readAppPackageJson())
}

module.exports.appPkg = appPkg
