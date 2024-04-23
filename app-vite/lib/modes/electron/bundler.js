const appPaths = require('../../app-paths')
const getPackage = require('../../helpers/get-package')
const { fatal } = require('../../helpers/logger')

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

function installBundler (bundlerName) {
  const bundler = bundlerMap[ bundlerName ]
  const nodePackager = require('../../helpers/node-packager')

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

function bundlerIsInstalled (bundlerName) {
  const appPkg = require(appPaths.resolve.app('package.json'))
  return bundlerName === 'packager'
    ? (hasPackage('@electron/packager', appPkg) || hasPackage('electron-packager', appPkg))
    : hasPackage('electron-builder', appPkg)
}

module.exports.bundlerIsInstalled = bundlerIsInstalled

module.exports.ensureInstall = function (bundlerName) {
  if (!isValidName(bundlerName)) {
    fatal(`Unknown bundler "${ bundlerName }" for Electron`)
  }

  if (!bundlerIsInstalled(bundlerName)) {
    installBundler(bundlerName)
  }
}

module.exports.getDefaultName = function () {
  if (bundlerIsInstalled('packager')) {
    return 'packager'
  }

  if (bundlerIsInstalled('builder')) {
    return 'builder'
  }

  return 'packager'
}

module.exports.getBundler = function (bundlerName) {
  return bundlerName === 'packager'
    ? (
        getPackage('@electron/packager')
        || getPackage('electron-packager')
      )
    : getPackage('electron-builder')
}
