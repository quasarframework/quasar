const fs = require('fs'),
  fse = require('fs-extra'),
  appPaths = require('../app-paths'),
  path = require('path'),
  getCapacitorBinaryBath = require('../capacitor/getCapacitorBinaryPath'),
  logger = require('../helpers/logger'),
  log = logger('app:mode-capacitor'),
  warn = logger('app:mode-capacitor', 'red'),
  { spawnSync } = require('../helpers/spawn'),
  nodePackager = require('../helpers/node-packager')

const capacitorDeps = {
  '@capacitor/cli': '^1.0.0',
  '@capacitor/core': '^1.0.0'
}

class Mode {
  get isInstalled() {
    return (
      fs.existsSync(appPaths.capacitorAndroidDir) ||
      fs.existsSync(appPaths.capacitorIosDir) ||
      fs.existsSync(appPaths.resolve.app('capacitor.config.json'))
    )
  }

  add() {
    if (this.isInstalled) {
      warn(`Capacitor support detected already. Aborting.`)
      return
    }

    const pkg = require(appPaths.resolve.app('package.json')),
      appName = pkg.productName || pkg.name || 'Quasar App'

    // TODO: determine if this is necessary
    if (/^[0-9]/.test(appName)) {
      warn(
        `⚠️  App product name cannot start with a number. ` +
          `Please change the "productName" prop in your /package.json then try again.`
      )
      return
    }

    const cmdParam =
      nodePackager === 'npm' ? ['install', '--save-dev'] : ['add', '--dev']

    log(`Installing Capacitor dependencies...`)
    spawnSync(
      nodePackager,
      cmdParam.concat(
        Object.keys(capacitorDeps).map(dep => {
          return `${dep}@${capacitorDeps[dep]}`
        })
      ),
      appPaths.appDir,
      () => warn('Failed to install Capacitor dependencies')
    )

    log(`Initializing capacitor...`)
    spawnSync(getCapacitorBinaryBath(), [
      'init',
      '--web-dir',
      'dist/capacitor',
      appName,
      pkg.cordovaId || 'org.quasar.capacitor.app'
    ])
    log(`Capacitor support was added`)
  }

  remove() {
    if (!this.isInstalled) {
      warn(`No Capacitor support detected. Aborting.`)
      return
    }

    log(`Removing Capacitor config`)
    fse.removeSync(appPaths.resolve.app('capacitor.config.json'))

    if (fse.existsSync(appPaths.capacitorAndroidDir)) {
      log(`Removing Android dir`)
      fse.removeSync(appPaths.capacitorAndroidDir)
      capacitorDeps['@capacitor/android'] = '^1.0.0'
    }
    if (fse.existsSync(appPaths.capacitorIosDir)) {
      log(`Removing Ios dir`)
      fse.removeSync(appPaths.capacitorIosDir)
      capacitorDeps['@capacitor/ios'] = '^1.0.0'
    }

    const cmdParam =
      nodePackager === 'npm' ? ['uninstall', '--save-dev'] : ['remove']

    log(`Uninstalling Capacitor dependencies...`)
    spawnSync(
      nodePackager,
      cmdParam.concat(Object.keys(capacitorDeps)),
      appPaths.appDir,
      () => warn('Failed to uninstall Capacitor dependencies')
    )

    log(`Capacitor support was removed`)
  }
}

module.exports = Mode
