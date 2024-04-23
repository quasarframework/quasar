const { getPackage } = require('../utils/get-package.js')
const { fatal } = require('../utils/logger.js')

const bundlerMap = {
  packager: {
    pkg: '@electron/packager',
    version: '18.3.2'
  },

  builder: {
    pkg: 'electron-builder',
    version: '24.3.0'
  }
}

function isValidName (bundlerName) {
  return [ 'packager', 'builder' ].includes(bundlerName)
}

function installBundler (bundlerName, nodePackager) {
  const bundler = bundlerMap[ bundlerName ]

  nodePackager.installPackage(
    `${ bundler.pkg }@^${ bundler.version }`,
    { isDevDependency: true, displayName: bundler.pkg }
  )
}

function hasPackage (pkgName, appPkg) {
  return (
    (appPkg.devDependencies && appPkg.devDependencies[ pkgName ])
    || (appPkg.dependencies && appPkg.dependencies[ pkgName ])
  ) !== void 0
}

module.exports.createInstance = function createInstance ({
  appPaths,
  pkg: { appPkg },
  cacheProxy
}) {
  const nodePackager = cacheProxy.getModule('nodePackager')

  function bundlerIsInstalled (bundlerName) {
    return bundlerName === 'packager'
      ? (hasPackage('@electron/packager', appPkg) || hasPackage('electron-packager', appPkg))
      : hasPackage('electron-builder', appPkg)
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
    const { appDir } = appPaths

    return bundlerName === 'packager'
      ? (
          getPackage('@electron/packager', appDir)
          || getPackage('electron-packager', appDir)
        )
      : getPackage('electron-builder', appDir)
  }

  return {
    bundlerIsInstalled,
    ensureInstall,
    getDefaultName,
    getBundler
  }
}
