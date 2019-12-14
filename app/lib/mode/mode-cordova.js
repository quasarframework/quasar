const fs = require('fs')
const fse = require('fs-extra')

const appPaths = require('../app-paths')
const logger = require('../helpers/logger')
const log = logger('app:mode-cordova')
const warn = logger('app:mode-cordova', 'red')
const { spawnSync } = require('../helpers/spawn')

function installDependencies () {
  if (fs.existsSync(appPaths.resolve.cordova('node_modules'))) {
    return
  }

  log('Installing dependencies in /src-cordova')
  spawnSync(
    'npm',
    [ 'install' ],
    { cwd: appPaths.cordovaDir },
    () => {
      warn(`⚠️  [FAIL] npm failed installing dependencies in /src-cordova`)
      process.exit(1)
    }
  )
}

class Mode {
  get isInstalled () {
    return fs.existsSync(appPaths.cordovaDir)
  }

  add (target) {
    if (this.isInstalled) {
      warn(`Cordova support detected already. Aborting.`)
      return
    }

    const pkg = require(appPaths.resolve.app('package.json'))
    const appName = pkg.productName || pkg.name || 'Quasar App'

    if (/^[0-9]/.test(appName)) {
      warn(
        `⚠️  App product name cannot start with a number. ` +
        `Please change the "productName" prop in your /package.json then try again.`
      )
      return
    }

    log('Creating Cordova source folder...')

    spawnSync(
      'cordova',
      ['create', 'src-cordova', pkg.cordovaId || 'org.quasar.cordova.app', appName],
      { cwd: appPaths.appDir },
      () => {
        warn(`⚠️  There was an error trying to install Cordova support`)
        process.exit(1)
      }
    )

    const www = appPaths.resolve.cordova('www')
    fse.removeSync(www)
    fse.copySync(
      appPaths.resolve.cli('templates/cordova'),
      appPaths.cordovaDir
    )

    log(`Cordova support was installed`)
    log(`App name was taken from package.json: "${appName}"`)
    log()
    warn(`If you want a different App name then remove Cordova support, edit productName field from package.json then add Cordova support again.`)
    warn()

    console.log(` ⚠️  WARNING!`)
    console.log(` ⚠️  If developing for iOS, it is HIGHLY recommended that you install the Ionic Webview Plugin.`)
    console.log(` ⚠️  Please refer to docs: https://quasar.dev/quasar-cli/developing-cordova-apps/preparation`)
    console.log(` ⚠️  --------`)
    console.log()

    if (!target) {
      console.log()
      console.log(` No Cordova platform has been added yet as these get installed on demand automatically when running "quasar dev" or "quasar build".`)
      log()
      return
    }

    this.addPlatform(target)
  }

  hasPlatform (target) {
    return fs.existsSync(appPaths.resolve.cordova(`platforms/${target}`))
  }

  addPlatform (target) {
    fse.ensureDirSync(appPaths.resolve.cordova(`www`))

    if (this.hasPlatform(target)) {
      installDependencies()
      return
    }

    log(`Adding Cordova platform "${target}"`)
    spawnSync(
      'cordova',
      ['platform', 'add', target],
      { cwd: appPaths.cordovaDir },
      () => {
        warn(`⚠️  There was an error trying to install Cordova platform "${target}"`)
        process.exit(1)
      }
    )
  }

  remove () {
    if (!this.isInstalled) {
      warn(`No Cordova support detected. Aborting.`)
      return
    }

    fse.removeSync(appPaths.cordovaDir)
    log(`Cordova support was removed`)
  }
}

module.exports = Mode
