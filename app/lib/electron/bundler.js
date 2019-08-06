const fs = require('fs')
const
  appPath = require('../app-paths'),
  packagerVersion = '13.1.0',
  getPackageJson = require('../helpers/get-package-json'),
  getPackage = require('../helpers/get-package'),
  log = require('../helpers/logger')('app:electron-bundle')

function isValidName (bundlerName) {
  return ['packager', 'builder'].includes(bundlerName)
}

function installBundler (bundlerName) {
  const
    { spawnSync } = require('../helpers/spawn'),
    nodePackager = require('../helpers/node-packager'),
    version = bundlerName === 'packager' ? `^${packagerVersion}` : 'latest',
    cmdParam = nodePackager === 'npm'
      ? ['install', '--save-dev']
      : ['add', '--dev']

  log(`Installing required Electron bundler (electron-${bundlerName})...`)
  spawnSync(
    nodePackager,
    cmdParam.concat([`electron-${bundlerName}@${version}`]),
    appPath.appDir,
    () => warn(`Failed to install electron-${bundlerName}`)
  )
}

function isInstalled (bundlerName) {
  return getPackageJson(`electron-${bundlerName}`) !== void 0
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
        pkg = getPackageJson(`electron-${bundlerName}`)

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
  return getPackage(`electron-${bundlerName}`)
}

module.exports.ensureBuilderCompatibility = function () {
  if (fs.existsSync(appPath.resolve.electron('icons/linux-256x256.png'))) {
    console.log()
    console.log(`\n⚠️  electron-builder requires a change to your src-electron/icons folder:
  * replace linux-256x256.png with a 512x512 px png file named "linux-512x512.png"
  * make sure to delete the old linux-256x256.png file
`)
    console.log()
    process.exit(1)
  }
}
