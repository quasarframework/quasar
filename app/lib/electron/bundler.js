const fs = require('fs')

const appPaths = require('../app-paths')
const getPackage = require('../helpers/get-package')
const { log, fatal } = require('../helpers/logger')

const versions = {
  packager: '15.2.0',
  builder: '22.4.0'
}

function isValidName (bundlerName) {
  return ['packager', 'builder'].includes(bundlerName)
}

function installBundler (bundlerName) {
  const { spawnSync } = require('../helpers/spawn')
  const nodePackager = require('../helpers/node-packager')
  const cmdParam = nodePackager === 'npm'
    ? ['install', '--save-dev']
    : ['add', '--dev']

  log(`Installing required Electron bundler (electron-${bundlerName})...`)
  spawnSync(
    nodePackager,
    cmdParam.concat([`electron-${bundlerName}@${'^' + versions[bundlerName]}`]),
    { cwd: appPaths.appDir, env: { ...process.env, NODE_ENV: 'development' } },
    () => fatal(`Failed to install electron-${bundlerName}`, 'FAIL')
  )
}

function bundlerIsInstalled (bundlerName) {
  const appPkg = require(appPaths.resolve.app('package.json'))
  const pgkName = `electron-${bundlerName}`
  return (
    (appPkg.devDependencies && appPkg.devDependencies[pgkName])
    || (appPkg.dependencies && appPkg.dependencies[pgkName])
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
  return getPackage(`electron-${bundlerName}`)
}
