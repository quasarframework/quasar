const appPaths = require('../app-paths')

function getMajorVersion (version) {
  const matches = version.match(/^(\d)\./)
  return parseInt(matches[1], 10)
}

module.exports = function (pkgName, folder = appPaths.appDir) {
  if (pkgName === '@quasar/app') {
    return getMajorVersion(require('../../package.json').version)
  }

  try {
    const pkg = require(
      require.resolve(`${pkgName}/package.json`, {
        paths: [ folder ]
      })
    )

    return getMajorVersion(pkg.version)
  }
  catch (e) {}
}
