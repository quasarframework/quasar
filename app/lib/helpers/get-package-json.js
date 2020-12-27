const appPaths = require('../app-paths')

module.exports = function (pkgName, folder = appPaths.appDir) {
  if (pkgName === '@quasar/app') {
    return require('../../package.json')
  }

  try {
    return require(
      require.resolve(`${pkgName}/package.json`, {
        paths: [ folder ]
      })
    )
  }
  catch (e) {}
}
