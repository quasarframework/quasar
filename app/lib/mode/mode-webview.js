const fs = require('fs'),
  fse = require('fs-extra'),
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  log = logger('app:mode-webview'),
  warn = logger('app:mode-webview', 'red')

class Mode {
  get isInstalled() {
    return fs.existsSync(appPaths.webviewDir)
  }

  add() {
    if (this.isInstalled) {
      warn(`WebView support detected already. Aborting.`)
      return
    }

    log('Creating WebView source folder...')

    fs.mkdirSync(appPaths.webviewDir)
    fse.copySync(appPaths.resolve.cli('templates/webview/rust-app'), appPaths.webviewDir)

    log(`WebView support was installed`)
  }

  remove() {
    if (!this.isInstalled) {
      warn(`No WebView support detected. Aborting.`)
      return
    }

    fse.removeSync(appPaths.webviewDir)
    log(`WebView support was removed`)
  }
}

module.exports = Mode
