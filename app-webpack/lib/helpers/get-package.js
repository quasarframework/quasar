const appPaths = require('../app-paths')
const getPackagePath = require('./get-package-path')

/**
 * Import a host package.
 */
module.exports = function getPackage (pkgName, folder = appPaths.appDir) {
  try {
    return require(getPackagePath(pkgName, folder))
  }
  catch (_) {
    /* do and return nothing */
  }
}
