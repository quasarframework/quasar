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
    fse.copySync(appPaths.resolve.protonPackage('templates/rust'), appPaths.protonDir)
    const files = require('fast-glob').sync(['**/_*'], {
      cwd: appPaths.protonDir
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
      fse.renameSync(appPaths.resolve.proton(rawPath), appPaths.resolve.proton(targetRelativePath))
    }

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
