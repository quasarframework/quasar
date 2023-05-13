
const fs = require('node:fs')
const fse = require('fs-extra')
const compileTemplate = require('lodash/template.js')

const appPaths = require('../../app-paths.js')
const { appPkg } = require('../../app-pkg.js')
const { log, warn } = require('../../utils/logger.js')
const { spawnSync } = require('../../utils/spawn.js')
const { nodePackager } = require('../../utils/node-packager.js')

function isModeInstalled () {
  return fs.existsSync(appPaths.capacitorDir)
}
module.exports.isModeInstalled = isModeInstalled

module.exports.addMode = async function addMode (silent, target) {
  if (isModeInstalled()) {
    if (target) {
      addPlatform(target)
    }
    else if (silent !== true) {
      warn('Capacitor support detected already. Aborting.')
    }

    return
  }

  const appName = appPkg.productName || appPkg.name || 'Quasar App'

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
    message: 'What is the Capacitor app id?',
    default: 'org.capacitor.quasar.app',
    validate: appId => (appId ? true : 'Please fill in a value')
  } ])

  log('Creating Capacitor source folder...')

  // Create /src-capacitor from template
  fse.ensureDirSync(appPaths.capacitorDir)

  const fglob = require('fast-glob')
  const scope = {
    appName,
    appId: answer.appId,
    pkg: appPkg,
    nodePackager: nodePackager.name
  }

  fglob.sync([ '**/*' ], {
    cwd: appPaths.resolve.cli('templates/capacitor')
  }).forEach(filePath => {
    const dest = appPaths.resolve.capacitor(filePath)
    const content = fs.readFileSync(appPaths.resolve.cli('templates/capacitor/' + filePath))
    fse.ensureFileSync(dest)
    fs.writeFileSync(dest, compileTemplate(content)(scope), 'utf-8')
  })

  const { ensureDeps } = require('./ensure-consistency.js')
  ensureDeps()

  const { capBin } = require('./cap-cli.js')

  log('Initializing capacitor...')
  spawnSync(
    capBin,
    [
      'init',
      '--web-dir',
      'www',
      scope.appName,
      scope.appId
    ],
    { cwd: appPaths.capacitorDir }
  )

  log('Capacitor support was added')

  if (!target) {
    console.log()
    console.log(' No Capacitor platform has been added yet as these get installed on demand automatically when running "quasar dev" or "quasar build".')
    log()
    return
  }

  addPlatform(target)
}

module.exports.removeMode = function removeMode () {
  if (!isModeInstalled()) {
    warn('No Capacitor support detected. Aborting.')
    return
  }

  log('Removing Capacitor folder')
  fse.removeSync(appPaths.capacitorDir)

  log('Capacitor support was removed')
}

function addPlatform (target) {
  const { ensureConsistency } = require('./ensure-consistency.js')
  ensureConsistency()

  // if it has the platform
  if (fs.existsSync(appPaths.resolve.capacitor(target))) {
    return
  }

  const { capBin, capVersion } = require('./cap-cli.js')

  if (capVersion >= 3) {
    nodePackager.installPackage(
      `@capacitor/${ target }@^${ capVersion }.0.0`,
      { displayName: 'Capacitor platform', cwd: appPaths.capacitorDir }
    )
  }

  log(`Adding Capacitor platform "${ target }"`)
  spawnSync(
    capBin,
    [ 'add', target ],
    { cwd: appPaths.capacitorDir }
  )
}
