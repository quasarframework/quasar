const
  fs = require('fs'),
  fse = require('fs-extra')

const
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  log = logger('app:mode-capacitor'),
  warn = logger('app:mode-capacitor', 'red'),
  { spawnSync } = require('../helpers/spawn'),
  nodePackager = require('../helpers/node-packager')

const capacitorDeps = require('../capacitor/capacitor-deps')

class Mode {
  get isInstalled() {
    return fs.existsSync(appPaths.capacitorDir)
  }

  add() {
    if (this.isInstalled) {
      warn(`Capacitor support detected already. Aborting.`)
      return
    }

    const
      pkgPath = appPaths.resolve.app('package.json'),
      pkg = require(pkgPath),
      appName = pkg.productName || pkg.name || 'Quasar App'

    if (/^[0-9]/.test(appName)) {
      warn(
        `⚠️  App product name cannot start with a number. ` +
          `Please change the "productName" prop in your /package.json then try again.`
      )
      return
    }

    const cmdParam = nodePackager === 'npm'
      ? ['install', '--save-dev']
      : ['add', '--dev']

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

    log(`Creating Capacitor source folder...`)

    // Need these otherwise Capacitor CLI will fail
    fse.copySync(
      appPaths.resolve.cli('templates/capacitor'),
      appPaths.capacitorDir
    )

    // update npmClient in capacitor config
    const capJsonPath = appPaths.resolve.capacitor('capacitor.config.json')
    const capJson = require(capJsonPath)
    capJson.npmClient = nodePackager
    if (pkg.capacitorId) {
      capJson.appId = pkg.capacitorId
    }
    else if (pkg.cordovaId) {
      capJson.appId = pkg.cordovaId
    }
    if (pkg.productName) {
      capJson.appName = pkg.productName
    }
    fs.writeFileSync(capJsonPath, JSON.stringify(capJson, null, 2), 'utf-8')

    // Copy package.json to prevent capacitor from reinstalling deps
    const updateCapPkg = require('../capacitor/update-cap-pkg')
    updateCapPkg()

    const capacitorCliPath = require('../capacitor/capacitor-cli-path')

    log(`Initializing capacitor...`)
    spawnSync(
      capacitorCliPath,
      [
        'init',
        '--web-dir',
        'www',
        appName,
        pkg.capacitorId || pkg.cordovaId || 'org.quasar.capacitor.app'
      ],
      appPaths.capacitorDir
    )

    ;['android', 'ios'].forEach(platform => {
      spawnSync(
        capacitorCliPath,
        ['add', platform],
        appPaths.capacitorDir
      )
    })

    const androidManifestPath = appPaths.resolve.capacitor(
      'android/app/src/main/AndroidManifest.xml'
    )
    // Enable cleartext support in manifest
    let androidManifest = fse.readFileSync(androidManifestPath, 'utf8')
    androidManifest = androidManifest.replace(
      '<application',
      '<application\n        android:usesCleartextTraffic="true"'
    )
    fse.writeFileSync(androidManifestPath, androidManifest)

    log(`Capacitor support was added`)
  }

  remove() {
    if (!this.isInstalled) {
      warn(`No Capacitor support detected. Aborting.`)
      return
    }

    log(`Removing Capacitor dir`)
    fse.removeSync(appPaths.capacitorDir)

    const cmdParam = nodePackager === 'npm'
      ? ['uninstall', '--save-dev']
      : ['remove', '--dev']

    log(`Removing Capacitor dependencies...`)
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
