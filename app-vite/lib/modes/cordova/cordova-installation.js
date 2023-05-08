
const fs = require('fs')
const fse = require('fs-extra')

const appPaths = require('../../app-paths')
const { log, warn, fatal } = require('../../helpers/logger')
const { spawnSync } = require('../../helpers/spawn')

function isInstalled () {
  return fs.existsSync(appPaths.cordovaDir)
}

async function add (silent, target) {
  if (isInstalled()) {
    if (target) {
      addPlatform(target)
    }
    else if (silent !== true) {
      warn('Cordova support detected already. Aborting.')
    }

    return
  }

  const pkg = require(appPaths.resolve.app('package.json'))
  const appName = pkg.productName || pkg.name || 'Quasar App'

  if (/^[0-9]/.test(appName)) {
    warn(
      'App product name cannot start with a number. '
      + 'Please change the "productName" prop in your /package.json then try again.'
    )
    return
  }

  const inquirer = require('inquirer')

  console.log()
  const answer = await inquirer.prompt([ {
    name: 'appId',
    type: 'input',
    message: 'What is the Cordova app id?',
    default: 'org.cordova.quasar.app',
    validate: appId => (appId ? true : 'Please fill in a value')
  } ])

  log('Creating Cordova source folder...')

  spawnSync(
    'cordova',
    [ 'create', 'src-cordova', answer.appId, appName ],
    { cwd: appPaths.appDir },
    () => {
      fatal('There was an error trying to install Cordova support')
    }
  )

  const { ensureWWW } = require('./ensure-consistency')
  ensureWWW(true)

  log('Cordova support was installed')
  log(`App name was taken from package.json: "${ appName }"`)
  log()
  warn('If you want a different App name then remove Cordova support, edit productName field from package.json then add Cordova support again.')
  warn()

  console.log(' ⚠️  WARNING!')
  console.log(' ⚠️  If developing for iOS, it is HIGHLY recommended that you install the Ionic Webview Plugin.')
  console.log(' ⚠️  Please refer to docs: https://quasar.dev/quasar-cli/developing-cordova-apps/preparation')
  console.log(' ⚠️  --------')
  console.log()

  if (!target) {
    console.log()
    console.log(' No Cordova platform has been added yet as these get installed on demand automatically when running "quasar dev" or "quasar build".')
    log()
    return
  }

  addPlatform(target)
}

function remove () {
  if (!isInstalled()) {
    warn('No Cordova support detected. Aborting.')
    return
  }

  fse.removeSync(appPaths.cordovaDir)
  log('Cordova support was removed')
}

function addPlatform (target) {
  const ensureConsistency = require('./ensure-consistency')
  ensureConsistency()

  // if it has the platform
  if (fs.existsSync(appPaths.resolve.cordova(`platforms/${ target }`))) {
    return
  }

  log(`Adding Cordova platform "${ target }"`)
  spawnSync(
    'cordova',
    [ 'platform', 'add', target ],
    { cwd: appPaths.cordovaDir },
    () => {
      warn(`There was an error trying to install Cordova platform "${ target }"`)
      process.exit(1)
    }
  )
}

module.exports = {
  isInstalled,
  add,
  remove
}
