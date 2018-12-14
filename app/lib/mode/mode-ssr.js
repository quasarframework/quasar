const
  fs = require('fs'),
  fse = require('fs-extra'),
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  log = logger('app:mode-ssr'),
  warn = logger('app:mode-ssr', 'red')

class Mode {
  get isInstalled () {
    return fs.existsSync(appPaths.ssrDir)
  }

  add (params) {
    if (this.isInstalled) {
      warn(`SSR support detected already. Aborting.`)
      return
    }

    log(`Creating SSR source folder...`)
    fse.copySync(appPaths.resolve.cli('templates/ssr'), appPaths.ssrDir)
    log(`SSR support was added`)
  }

  remove () {
    if (!this.isInstalled) {
      warn(`No SSR support detected. Aborting.`)
      return
    }

    log(`Removing SSR source folder`)
    fse.removeSync(appPaths.ssrDir)
    log(`SSR support was removed`)
  }
}

module.exports = Mode
