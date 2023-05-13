const appPaths = require('../app-paths.js')
const { getPackagePath } = require('./get-package-path.js')

/**
 * Import a host package.
 */
module.exports.getPackage = function getPackage (pkgName, folder = appPaths.appDir) {
  try {
    return require(getPackagePath(pkgName, folder))
  }
  catch (_) {
    /* do and return nothing */
  }
}
