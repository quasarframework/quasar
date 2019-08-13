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

    fs.mkdirSync(appPaths.tauriDir)
    fse.copySync(appPaths.resolve.tauriPackage('templates/rust'), appPaths.tauriDir)
    const files = require('fast-glob').sync(['**/_*'], {
      cwd: appPaths.tauriDir
    })
    for (const rawPath of files) {
      const targetRelativePath = rawPath.split('/').map(name => {
        // dotfiles are ignored when published to npm, therefore in templates
        // we need to use underscore instead (e.g. "_gitignore")
        if (name.charAt(0) === '_' && name.charAt(1) !== '_') {
          return `.${name.slice(1)}`
        }
        if (name.charAt(0) === '_' && name.charAt(1) === '_') {
          return `${name.slice(1)}`
        }
        return name
      }).join('/')
      fse.renameSync(appPaths.resolve.tauri(rawPath), appPaths.resolve.tauri(targetRelativePath))
    }

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
