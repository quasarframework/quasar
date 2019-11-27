const
  appPaths = require('../app-paths')

module.exports = function (pkgName) {
  if (pkgName === '@quasar/app') {
    return require('../../package.json')
  }

  try {
    return require(
      require.resolve(`${pkgName}/package.json`, {
        paths: [ appPaths.appDir ]
      })
    )
  }
  catch (e) {}
}
