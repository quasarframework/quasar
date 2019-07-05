const fs = require('fs'),
  fse = require('fs-extra'),
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  log = logger('app:mode-proton'),
  warn = logger('app:mode-proton', 'red')

class Mode {
  get isInstalled() {
    return fs.existsSync(appPaths.protonDir)
  }

  add() {
    if (this.isInstalled) {
      warn(`Proton support detected already. Aborting.`)
      return
    }

    log('Creating Proton source folder...')

    fs.mkdirSync(appPaths.protonDir)
    fse.copySync(appPaths.resolve.cli('templates/proton/rust'), appPaths.protonDir)

    log(`Proton support was installed`)
  }

  remove() {
    if (!this.isInstalled) {
      warn(`No Proton support detected. Aborting.`)
      return
    }

    fse.removeSync(appPaths.protonDir)
    log(`Proton support was removed`)
  }
}

 module.exports = Mode
