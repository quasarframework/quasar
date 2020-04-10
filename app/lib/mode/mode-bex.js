const
  fs = require('fs'),
  fse = require('fs-extra'),
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  log = logger('app:mode-bex'),
  warn = logger('app:mode-bex', 'red')

class Mode {
  get isInstalled () {
    return fs.existsSync(appPaths.bexDir)
  }

  add (params) {
    if (this.isInstalled) {
      warn(`Browser Extension support detected already. Aborting.`)
      return
    }

    log(`Creating Browser Extension source folder...`)
    fse.copySync(appPaths.resolve.cli('templates/bex'), appPaths.bexDir)
    log(`Browser Extension support was added`)
  }

  remove () {
    if (!this.isInstalled) {
      warn(`No Browser Extension support detected. Aborting.`)
      return
    }

    log(`Removing Browser Extension source folder`)
    fse.removeSync(appPaths.bexDir)
    log(`Browser Extension support was removed`)
  }
}

module.exports = Mode
