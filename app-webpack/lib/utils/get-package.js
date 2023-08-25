const { getPackagePath } = require('./get-package-path.js')

/**
 * Import a host package.
 */
module.exports.getPackage = function getPackage (pkgName, dir) {
  if (dir === void 0) {
    console.error('getPackage() -> dir param is required')
    process.exit(1)
  }

  try {
    const pkgPath = getPackagePath(pkgName, dir)
    return require(pkgPath)
  }
  catch (_) {
    /* do and return nothing */
  }
}
