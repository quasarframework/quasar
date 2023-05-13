const { appPkg } = require('../../app-pkg.js')
const { getPackage } = require('../../utils/get-package.js')
const { fatal } = require('../../utils/logger.js')
const { nodePackager } = require('../../utils/node-packager.js')

const versions = {
  packager: '17.1.1',
  builder: '24.3.0'
}

function isValidName (bundlerName) {
  return [ 'packager', 'builder' ].includes(bundlerName)
}

function installBundler (bundlerName) {
  nodePackager.installPackage(
    `electron-${ bundlerName }@^${ versions[ bundlerName ] }`,
    { isDevDependency: true, displayName: `electron-${ bundlerName }` }
  )
}

function bundlerIsInstalled (bundlerName) {
  const pgkName = `electron-${ bundlerName }`
  return (
    (appPkg.devDependencies && appPkg.devDependencies[ pgkName ])
    || (appPkg.dependencies && appPkg.dependencies[ pgkName ])
  ) !== void 0
}

module.exports.bundlerIsInstalled = bundlerIsInstalled

module.exports.ensureInstall = function ensureInstall (bundlerName) {
  if (!isValidName(bundlerName)) {
    fatal(`Unknown bundler "${ bundlerName }" for Electron`)
  }

  if (!bundlerIsInstalled(bundlerName)) {
    installBundler(bundlerName)
  }
}

module.exports.getDefaultName = function getDefaultName () {
  if (bundlerIsInstalled('packager')) {
    return 'packager'
  }

  if (bundlerIsInstalled('builder')) {
    return 'builder'
  }

  return 'packager'
}

module.exports.getBundler = function getBundler (bundlerName) {
  return getPackage(`electron-${ bundlerName }`)
}
