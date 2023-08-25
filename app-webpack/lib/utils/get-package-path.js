/**
 * Get the resolved path of a host package.
 */
module.exports.getPackagePath = function getPackagePath (pkgName, dir) {
  if (dir === void 0) {
    console.error('getPackagePath() -> dir param is required')
    process.exit(1)
  }

  try {
    return require.resolve(pkgName, {
      paths: [ dir ]
    })
  }
  catch (_) {
    /* do and return nothing */
  }
}
