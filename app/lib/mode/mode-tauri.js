const fse = require('fs-extra'),
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  log = logger('app:mode-tauri'),
  warn = logger('app:mode-tauri', 'red'),
  nodePackager = require('../helpers/node-packager'),
  { spawnSync } = require('../helpers/spawn')

const
  tauriDeps = {
    '@quasar/tauri': '*' // temporary
  }

class Mode {
  get isInstalled() {
    return fse.existsSync(appPaths.tauriDir)
  }

  add() {
    if (this.isInstalled) {
      warn(`Tauri support detected already. Aborting.`)
      return
    }
    const cmdParam = nodePackager === 'npm'
      ? ['install', '--save-dev']
      : ['add', '--dev']

    log(`Installing Tauri dependencies...`)
    spawnSync(
      nodePackager,
      cmdParam.concat(Object.keys(tauriDeps).map(dep => {
        return `${dep}@${tauriDeps[dep]}`
      })),
      appPaths.appDir,
      () => warn('Failed to install Tauri dependencies')
    )

    log('Creating Tauri source folder...')

    const { inject } = require(require.resolve('@quasar/tauri/mode/template', {
      paths: [ appPaths.appDir ]
    }))
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
