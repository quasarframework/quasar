const { readFileSync } = require('node:fs')

const { getPackageJson } = require('../utils/get-package-json.js')

module.exports.getPkg = function getPkg (appPaths) {
  const { appDir } = appPaths
  const appPkgPath = appPaths.resolve.app('package.json')

  function readAppPackageJson () {
    return JSON.parse(
      readFileSync(appPkgPath, 'utf-8')
    )
  }

  const acc = {
    appPkg: readAppPackageJson(),
    updateAppPackageJson () {
      acc.appPkg = readAppPackageJson()
    },
    quasarPkg: getPackageJson('quasar', appDir),
    webpackPkg: getPackageJson('webpack', appDir)
  }

  return acc
}
