const appPaths = require('../app-paths')
const getPackagePath = require('./get-package-path')

/**
 * Get package.json of a host package.
 *
 * Don't use it for direct dependencies of this project.
 * Use plain `require('pkg')` and `require.resolve('pkg')` instead.
 */
module.exports = function getPackageJson (pkgName, folder = appPaths.appDir) {
  try {
    return require(getPackagePath(`${ pkgName }/package.json`, folder))
  }
  catch (_) {
    /* do and return nothing */
  }
}
