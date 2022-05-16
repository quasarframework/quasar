const appPaths = require('../app-paths')
const { version } = require('../../package.json')

function getMajorVersion (version) {
  const matches = version.match(/^(\d)\./)
  return parseInt(matches[1], 10)
}

const appMajorVersion = getMajorVersion(version)

module.exports = function (pkgName, folder = appPaths.appDir) {
  if (pkgName === '@quasar/app-vite') {
    return appMajorVersion
  }

  try {
    const pkg = require(
      require.resolve(`${pkgName}/package.json`, {
        paths: [ folder ].concat(module.paths)
      })
    )

    return getMajorVersion(pkg.version)
  }
  catch (e) {}
}
