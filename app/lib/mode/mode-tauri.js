const fs = require('fs'),
  fse = require('fs-extra'),
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  log = logger('app:mode-tauri'),
  warn = logger('app:mode-tauri', 'red')

class Mode {
  get isInstalled() {
    return fs.existsSync(appPaths.tauriDir)
  }

  add() {
    if (this.isInstalled) {
      warn(`Tauri support detected already. Aborting.`)
      return
    }

    log('Creating Tauri source folder...')

    const { inject } = require('@quasar/tauri/mode/template')
    inject(appPaths.tauriDir)

    log(`Tauri support was installed`)
  }

  remove() {
    if (!this.isInstalled) {
      warn(`No Tauri support detected. Aborting.`)
      return
    }

    fse.removeSync(appPaths.tauriDir)
    log(`Tauri support was removed`)
  }
}

 module.exports = Mode
