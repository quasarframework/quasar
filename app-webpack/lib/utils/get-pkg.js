const { readFileSync, statSync } = require('node:fs')

const { warning } = require('./logger.js')
const { getPackageJson } = require('../utils/get-package-json.js')

module.exports.getPkg = function getPkg (appPaths) {
  const { appDir, cliDir } = appPaths
  const appPkgPath = appPaths.resolve.app('package.json')

  let appPkg = {}
  let lastAppPkgModifiedTime = 0

  function getAppPackageJson () {
    const { mtime } = statSync(appPkgPath)

    if (mtime !== lastAppPkgModifiedTime) {
      lastAppPkgModifiedTime = mtime
      try {
        appPkg = JSON.parse(
          readFileSync(appPkgPath, 'utf-8')
        )
      }
      catch (err) {
        warning('Could not parse app\'s package.json. The file is malformed:')
        console.error(err)
      }
    }

    return appPkg
  }

  const acc = {
    quasarPkg: getPackageJson('quasar', appDir),
    webpackPkg: (
      getPackageJson('webpack', appDir)
      || getPackageJson('webpack', cliDir)
    )
  }

  Object.defineProperty(acc, 'appPkg', { get: getAppPackageJson })

  return acc
}
