const fs = require('node:fs')
const fse = require('fs-extra')

const appPaths = require('../app-paths.js')
const { log, warn } = require('../utils/logger.js')

module.exports.QuasarMode = class QuasarMode {
  get isInstalled () {
    return fs.existsSync(appPaths.bexDir)
  }

  add () {
    if (this.isInstalled) {
      warn('Browser Extension support detected already. Aborting.')
      return
    }

    log('Creating Browser Extension source folder...')
    fse.copySync(appPaths.resolve.cli('templates/bex'), appPaths.bexDir)
    log('Browser Extension support was added')
  }

  remove () {
    if (!this.isInstalled) {
      warn('No Browser Extension support detected. Aborting.')
      return
    }

    log('Removing Browser Extension source folder')
    fse.removeSync(appPaths.bexDir)
    log('Browser Extension support was removed')
  }
}
