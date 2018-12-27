const
  fs = require('fs'),
  fse = require('fs-extra'),
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  log = logger('app:mode-pwa'),
  warn = logger('app:mode-pwa', 'red')

class Mode {
  get isInstalled () {
    return fs.existsSync(appPaths.pwaDir)
  }

  add (params) {
    if (this.isInstalled) {
      warn(`PWA support detected already. Aborting.`)
      return
    }

    log(`Creating PWA source folder...`)
    fse.copySync(appPaths.resolve.cli('templates/pwa'), appPaths.pwaDir)
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
