const fs = require('fs')
const fse = require('fs-extra')

const
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  log = logger('app:mode-capacitor'),
  warn = logger('app:mode-capacitor', 'red'),
  { spawnSync } = require('../helpers/spawn'),
  nodePackager = require('../helpers/node-packager')

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

    log(`Creating Capacitor source folder...`)

    // Create /src-capacitor from template
    fse.copySync(
      appPaths.resolve.cli('templates/capacitor'),
      appPaths.capacitorDir
    )

    // Update /src-capacitor/package.json
    require('../capacitor/update-cap-pkg')()

    const cmdParam = nodePackager === 'npm'
      ? ['install']
      : []

    log(`Installing Capacitor dependencies...`)
    spawnSync(
      nodePackager,
      cmdParam,
      appPaths.capacitorDir,
      () => warn('Failed to install Capacitor dependencies')
    )

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

    log(`Removing Capacitor folder`)
    fse.removeSync(appPaths.capacitorDir)

    log(`Capacitor support was removed`)
  }
}

module.exports = Mode
