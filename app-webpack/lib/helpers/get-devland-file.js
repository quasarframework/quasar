const appPaths = require('../app-paths')

module.exports = function (name) {
  try {
    return require(
      require.resolve(name, {
        paths: [ appPaths.appDir ]
      })
    )
  }
  catch (e) {}
}
