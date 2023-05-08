const appPaths = require('../app-paths')
const getPackageJson = require('./get-package-json')

function getMajorVersion (version) {
  const matches = version.match(/^(\d)\./)
  return parseInt(matches[ 1 ], 10)
}

/**
 * Get major version of a host package.
 */
module.exports = function getPackageMajorVersion (pkgName, folder = appPaths.appDir) {
  const pkg = getPackageJson(pkgName, folder)

  if (pkg) {
    return getMajorVersion(pkg.version)
  }
}
