const { getPackage } = require('../utils/get-package.js')
const { fatal } = require('../utils/logger.js')

const versions = {
  packager: '17.1.1',
  builder: '24.3.0'
}

function isValidName (bundlerName) {
  return [ 'packager', 'builder' ].includes(bundlerName)
}

function installBundler (bundlerName, nodePackager) {
  nodePackager.installPackage(
    `electron-${ bundlerName }@^${ versions[ bundlerName ] }`,
    { isDevDependency: true, displayName: `electron-${ bundlerName }` }
  )
}

module.exports.createInstance = function createInstance ({
  appPaths,
  pkg: { appPkg },
  cacheProxy
}) {
  const nodePackager = cacheProxy.getModule('nodePackager')

  function bundlerIsInstalled (bundlerName) {
    const pgkName = `electron-${ bundlerName }`
    return (
      (appPkg.devDependencies && appPkg.devDependencies[ pgkName ])
      || (appPkg.dependencies && appPkg.dependencies[ pgkName ])
    ) !== void 0
  }

  function ensureInstall (bundlerName) {
    if (!isValidName(bundlerName)) {
      fatal(`Unknown bundler "${ bundlerName }" for Electron`)
    }

    if (!bundlerIsInstalled(bundlerName)) {
      installBundler(bundlerName, nodePackager)
    }
  }

  function getDefaultName () {
    if (bundlerIsInstalled('packager')) {
      return 'packager'
    }

    if (bundlerIsInstalled('builder')) {
      return 'builder'
    }

    return 'packager'
  }

  function getBundler (bundlerName) {
    return getPackage(`electron-${ bundlerName }`, appPaths.appDir)
  }

  return {
    bundlerIsInstalled,
    ensureInstall,
    getDefaultName,
    getBundler
  }
}
