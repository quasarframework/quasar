const appPaths = require('../app-paths.js')
const { getPackagePath } = require('./get-package-path.js')

/**
 * Get package.json of a host package.
 *
 * Don't use it for direct dependencies of this project.
 * Use plain `require('pkg')` and `require.resolve('pkg')` instead.
 */
module.exports.getPackageJson = function getPackageJson (pkgName, folder = appPaths.appDir) {
  try {
    return require(getPackagePath(`${ pkgName }/package.json`, folder))
  }
  catch (_) {
    /* do and return nothing */
  }
}
