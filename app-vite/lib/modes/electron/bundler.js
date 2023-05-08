const appPaths = require('../../app-paths')
const getPackage = require('../../helpers/get-package')
const { fatal } = require('../../helpers/logger')

const versions = {
  packager: '17.1.1',
  builder: '24.3.0'
}

function isValidName (bundlerName) {
  return [ 'packager', 'builder' ].includes(bundlerName)
}

function installBundler (bundlerName) {
  const nodePackager = require('../../helpers/node-packager')

  nodePackager.installPackage(
    `electron-${ bundlerName }@^${ versions[ bundlerName ] }`,
    { isDevDependency: true, displayName: `electron-${ bundlerName }` }
  )
}

function bundlerIsInstalled (bundlerName) {
  const appPkg = require(appPaths.resolve.app('package.json'))
  const pgkName = `electron-${ bundlerName }`
  return (
    (appPkg.devDependencies && appPkg.devDependencies[ pgkName ])
    || (appPkg.dependencies && appPkg.dependencies[ pgkName ])
  ) !== void 0
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
  return getPackage(`electron-${ bundlerName }`)
}
