const fs = require('fs')
const fse = require('fs-extra')
const compileTemplate = require('lodash.template')

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
    fse.ensureDirSync(appPaths.capacitorDir)

    const fglob = require('fast-glob')
    const scope = {
      appName,
      appId: pkg.capacitorId || pkg.cordovaId || 'org.quasar.capacitor.app',
      pkg
    }

    fglob.sync(['**/*'], {
      cwd: appPaths.resolve.cli('templates/capacitor')
    }).forEach(filePath => {
      const dest = appPaths.resolve.capacitor(filePath)
      const content = fs.readFileSync(appPaths.resolve.cli('templates/capacitor/' + filePath))
      fse.ensureFileSync(dest)
      fs.writeFileSync(dest, compileTemplate(content)(scope), 'utf-8')
    })

    const cmdParam = nodePackager === 'npm'
      ? ['install']
      : []

    log(`Installing Capacitor dependencies...`)
    spawnSync(
      nodePackager,
      cmdParam,
      { cwd: appPaths.capacitorDir },
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
        scope.appName,
        scope.appId
      ],
      { cwd: appPaths.capacitorDir }
    )

    ;['android', 'ios'].forEach(platform => {
      spawnSync(
        capacitorCliPath,
        ['add', platform],
        { cwd: appPaths.capacitorDir }
      )
    })

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
