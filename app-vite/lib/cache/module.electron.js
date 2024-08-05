import { getPackage } from '../utils/get-package.js'
import { fatal } from '../utils/logger.js'

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

export async function createInstance ({
  appPaths,
  pkg: { appPkg },
  cacheProxy
}) {
  const nodePackager = await cacheProxy.getModule('nodePackager')

  function bundlerIsInstalled (bundlerName) {
    const bundler = bundlerMap[ bundlerName ]
    return hasPackage(bundler.pkg, appPkg)
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

  // May return "{ default }" (@electron/packager) or directly the package (electron-builder);
  async function getBundler (bundlerName) {
    const bundler = bundlerMap[ bundlerName ]
    return getPackage(bundler.pkg, appPaths.appDir)
  }

  return {
    bundlerIsInstalled,
    ensureInstall,
    getDefaultName,
    getBundler
  }
}
