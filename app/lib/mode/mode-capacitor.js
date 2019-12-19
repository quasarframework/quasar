const fs = require('fs')
const fse = require('fs-extra')
const compileTemplate = require('lodash.template')

const appPaths = require('../app-paths')
const logger = require('../helpers/logger')
const log = logger('app:mode-capacitor')
const warn = logger('app:mode-capacitor', 'red')
const { spawnSync } = require('../helpers/spawn')
const nodePackager = require('../helpers/node-packager')

class Mode {
  get isInstalled () {
    return fs.existsSync(appPaths.capacitorDir)
  }

  add (target) {
    if (this.isInstalled) {
      warn(`Capacitor support detected already. Aborting.`)
      return
    }

    const pkgPath = appPaths.resolve.app('package.json')
    const pkg = require(pkgPath)
    const appName = pkg.productName || pkg.name || 'Quasar App'

    if (/^[0-9]/.test(appName)) {
      warn(
        `⚠️  App product name cannot start with a number. ` +
          `Please change the "productName" prop in your /package.json then try again.`
      )
      return
    }

    log(`Creating Capacitor source folder...`)

    // Create /src-capacitor from template
    fse.ensureDirSync(appPaths.capacitorDir)

    const fglob = require('fast-glob')
    const scope = {
      appName,
      appId: pkg.capacitorId || pkg.cordovaId || 'org.quasar.capacitor.app',
      pkg,
      nodePackager
    }

    fglob.sync(['**/*'], {
      cwd: appPaths.resolve.cli('templates/capacitor')
    }).forEach(filePath => {
      const dest = appPaths.resolve.capacitor(filePath)
      const content = fs.readFileSync(appPaths.resolve.cli('templates/capacitor/' + filePath))
      fse.ensureFileSync(dest)
      fs.writeFileSync(dest, compileTemplate(content)(scope), 'utf-8')
    })

    const { ensureDeps } = require('../capacitor/ensure-consistency')
    ensureDeps()

    const capacitorCliPath = require('../capacitor/capacitor-cli-path')

    log(`Initializing capacitor...`)
    spawnSync(
      capacitorCliPath,
      [
        'init',
        '--web-dir',
        'www',
        scope.appName,
        scope.appId
      ],
      { cwd: appPaths.capacitorDir }
    )

    log(`Capacitor support was added`)

    if (!target) {
      console.log()
      console.log(` No Capacitor platform has been added yet as these get installed on demand automatically when running "quasar dev" or "quasar build".`)
      log()
      return
    }

    this.addPlatform(target)
  }

  hasPlatform (target) {
    return fs.existsSync(appPaths.resolve.capacitor(target))
  }

  addPlatform (target) {
    const ensureConsistency = require('../capacitor/ensure-consistency')
    ensureConsistency()

    if (this.hasPlatform(target)) {
      return
    }

    const capacitorCliPath = require('../capacitor/capacitor-cli-path')

    log(`Adding Capacitor platform "${target}"`)
    spawnSync(
      capacitorCliPath,
      ['add', target],
      { cwd: appPaths.capacitorDir }
    )
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
