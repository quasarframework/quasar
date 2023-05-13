const appPaths = require('../app-paths.js')

/**
 * Get the resolved path of a host package.
 */
module.exports.getPackagePath = function getPackagePath (pkgName, folder = appPaths.appDir) {
  try {
    return require.resolve(pkgName, {
      paths: [ folder ]
    })
  }
  catch (_) {
    /* do and return nothing */
  }
}
