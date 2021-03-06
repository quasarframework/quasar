const fs = require('fs')

const appPaths = require('../app-paths')
const getPackage = require('../helpers/get-package')
const { log, warn, fatal } = require('../helpers/logger')

const versions = {
  packager: '14.1.1',
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
    () => warn(`Failed to install electron-${bundlerName}`)
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
    fatal(`Unknown bundler "${ bundlerName }" for Electron\n`)
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

module.exports.ensureBuilderCompatibility = function () {
  if (fs.existsSync(appPaths.resolve.electron('icons/linux-256x256.png'))) {
    console.log()
    console.log(`\n ⚠️  electron-builder requires a change to your src-electron/icons folder:
  * replace linux-256x256.png with a 512x512 px png file named "linux-512x512.png"
  * make sure to delete the old linux-256x256.png file
`)
    console.log()
    process.exit(1)
  }
}
