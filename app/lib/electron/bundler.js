const fs = require('fs')
const
  appPath = require('../app-paths'),
  packagerVersion = '13.1.0',
  log = require('../helpers/logger')('app:electron-bundle')

function isValidName (bundlerName) {
  return ['packager', 'builder'].includes(bundlerName)
}

function installBundler (bundlerName) {
  const
    spawn = require('../helpers/spawn'),
    nodePackager = require('../helpers/node-packager'),
    version = bundlerName === 'packager' ? `^${packagerVersion}` : 'latest',
    cmdParam = nodePackager === 'npm'
      ? ['install', '--save-dev']
      : ['add', '--dev']

  log(`Installing required Electron bundler (electron-${bundlerName})...`)
  spawn.sync(
    nodePackager,
    cmdParam.concat([`electron-${bundlerName}@${version}`]),
    appPaths.appDir,
    () => warn(`Failed to install electron-${bundlerName}`)
  )
}

function isInstalled (bundlerName) {
  return fs.existsSync(appPath.resolve.app(`node_modules/electron-${bundlerName}`))
}

module.exports.ensureInstall = function (bundlerName) {
  if (!isValidName(bundlerName)) {
    warn(`⚠️  Unknown bundler "${ bundlerName }" for Electron`)
    warn()
    process.exit(1)
  }

  if (bundlerName === 'packager') {
    if (isInstalled('packager')) {
      const
        semver = require('semver'),
        pkg = require(appPath.resolve.app(`node_modules/electron-${bundlerName}/package.json`))

      if (semver.satisfies(pkg.version, `>= ${packagerVersion}`)) {
        return
      }
    }
  }
  else if (isInstalled('builder')) {
    return
  }

  installBundler(bundlerName)
}

module.exports.getDefaultName = function () {
  if (isInstalled('packager')) {
    return 'packager'
  }

  if (isInstalled('builder')) {
    return 'builder'
  }

  return 'packager'
}

module.exports.getBundler = function (bundlerName) {
  return require(appPath.resolve.app(`node_modules/electron-${bundlerName}`))
}

module.exports.ensureBuilderCompatibility = function () {
  if (fs.existsSync(appPaths.resolve.electron('icons/linux-256x256.png'))) {
    console.log()
    console.log(`\n⚠️  electron-builder requires a change to your src-electron/icons folder:
  * replace linux-256x256.png with a 512x512 px png file named "linux-512x512.png"
  * make sure to delete the old linux-256x256.png file
`)
    console.log()
    process.exit(1)
  }
}
