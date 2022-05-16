const appPaths = require('../app-paths')

module.exports = function (pkgName) {
  try {
    return require(
      require.resolve(pkgName, {
        paths: [ appPaths.appDir ].concat(module.paths)
      })
    )
  }
  catch (e) {}
}
