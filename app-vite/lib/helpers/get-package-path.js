const appPaths = require('../app-paths')

/**
 * Get the resolved path of a host package.
 */
module.exports = function getPackagePath(pkgName, folder = appPaths.appDir) {
  try {
    return require.resolve(pkgName, {
      paths: [ folder ]
    })
  }
  catch (e) {}
}
