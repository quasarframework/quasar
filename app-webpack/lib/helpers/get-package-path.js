const appPaths = require('../app-paths')

module.exports = function (pkgName, folder = appPaths.appDir) {
  try {
    return require.resolve(pkgName, {
      paths: [ folder ].concat(module.paths)
    })
  }
  catch (e) {}
}
