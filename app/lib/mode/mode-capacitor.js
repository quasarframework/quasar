const fs = require('fs'),
  fse = require('fs-extra'),
  appPaths = require('../app-paths'),
  inquirer = require('inquirer'),
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
    return fs.existsSync(appPaths.capacitorDir)
  }

  async add() {
    if (this.isInstalled) {
      warn(`Capacitor support detected already. Aborting.`)
      return
    }
    const { platforms } = await inquirer.prompt([
      {
        type: 'checkbox',
        choices: ['android', 'ios'],
        name: 'platforms',
        message:
          'What platforms would you like to install? Choose at least one.',
        default: ['android'],
        validate: options => options.length > 0
      }
    ])

    platforms.forEach(platform => {
      capacitorDeps[`@capacitor/${platform}`] = '^1.0.0'
    })

    const pkgPath = appPaths.resolve.app('package.json'),
      pkg = require(pkgPath),
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

    fse.ensureDirSync(appPaths.capacitorDir)
    log(`Initializing capacitor...`)
    spawnSync(
      getCapacitorBinaryBath(),
      [
        'init',
        '--web-dir',
        '../dist/capacitor',
        appName,
        pkg.cordovaId || 'org.quasar.capacitor.app'
      ],
      appPaths.capacitorDir
    )
    // Add copied package.json to .gitignore as it is auto-generated
    fse.writeFileSync(appPaths.resolve.capacitor('.gitignore'), 'package.json')
    // Adding platforms will fail if there is no index
    fse.ensureFileSync(appPaths.resolve.app('dist/capacitor/index.html'))
    // Copy package.json to prevent capacitor from reinstalling deps
    fse.copySync(pkgPath, appPaths.resolve.capacitor('package.json'))
    platforms.forEach(platform => {
      spawnSync(
        getCapacitorBinaryBath(),
        ['add', platform],
        appPaths.capacitorDir
      )
    })
    if (platforms.includes('android')) {
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
    }
    log(`Capacitor support was added`)
  }

  remove() {
    if (!this.isInstalled) {
      warn(`No Capacitor support detected. Aborting.`)
      return
    }

    log(`Removing Capacitor dir`)
    fse.removeSync(appPaths.capacitorDir)

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
