const { readFileSync, statSync } = require('node:fs')
const { parseJSON } = require('confbox')

const { warning } = require('./logger.js')
const { getPackageJson } = require('../utils/get-package-json.js')

/**
 * @param {import('../../types/app-paths').QuasarAppPaths} appPaths
 *
 * @returns {import('../../types/configuration/context').InternalQuasarContext['pkg']}
 */
module.exports.getPkg = function getPkg(appPaths) {
  const { appDir, cliDir } = appPaths
  const appPkgPath = appPaths.resolve.app('package.json')

  let appPkg = {}
  let lastAppPkgModifiedTime = 0

  function getAppPackageJson() {
    const { mtime } = statSync(appPkgPath)

    if (mtime !== lastAppPkgModifiedTime) {
      lastAppPkgModifiedTime = mtime
      try {
        // This may get updated and written, so use parseJSON to preserve formatting
        appPkg = parseJSON(readFileSync(appPkgPath, 'utf-8'))
      } catch (err) {
        warning("Could not parse app's package.json. The file is malformed:")
        console.error(err)
      }
    }

    return appPkg
  }

  const acc = {
    quasarPkg: getPackageJson('quasar', appDir),
    webpackPkg:
      getPackageJson('webpack', appDir) || getPackageJson('webpack', cliDir)
  }

  Object.defineProperty(acc, 'appPkg', { get: getAppPackageJson })

  return acc
}
