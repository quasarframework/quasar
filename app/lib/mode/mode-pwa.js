const fs = require('fs')
const fse = require('fs-extra')

const appPaths = require('../app-paths')
const logger = require('../helpers/logger')
const log = logger('app:mode-pwa')
const warn = logger('app:mode-pwa', 'red')

class Mode {
  get isInstalled () {
    return fs.existsSync(appPaths.pwaDir)
  }

  add () {
    if (this.isInstalled) {
      warn(`PWA support detected already. Aborting.`)
      return
    }

    log(`Creating PWA source folder...`)
    fse.copySync(appPaths.resolve.cli('templates/pwa'), appPaths.pwaDir)

    log(`Copying PWA icons to /src/statics/icons/ (if they are not already there)...`)
    fse.copySync(
      appPaths.resolve.cli('templates/pwa-icons'),
      appPaths.resolve.src('statics/icons'),
      { overwrite: false }
    )

    log(`PWA support was added`)
  }

  remove () {
    if (!this.isInstalled) {
      warn(`No PWA support detected. Aborting.`)
      return
    }

    log(`Removing PWA source folder`)
    fse.removeSync(appPaths.pwaDir)

    log(`PWA support was removed`)
  }
}

module.exports = Mode
