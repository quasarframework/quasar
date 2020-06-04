const fs = require('fs')
const fse = require('fs-extra')

const appPaths = require('../app-paths')
const { log, warn } = require('../helpers/logger')
const { spawnSync } = require('../helpers/spawn')
const nodePackager = require('../helpers/node-packager')
const { bundlerIsInstalled } = require('../electron/bundler')

const electronDeps = {
  'electron': '^9.0.0',
  'electron-debug': '^3.0.1',
  'electron-devtools-installer': '^3.0.0',
  'devtron': '^1.4.0'
}

class Mode {
  get isInstalled () {
    return fs.existsSync(appPaths.electronDir)
  }

  add () {
    if (this.isInstalled) {
      warn(`Electron support detected already. Aborting.`)
      return
    }

    const cmdParam = nodePackager === 'npm'
      ? ['install', '--save-dev']
      : ['add', '--dev']

    log(`Installing Electron dependencies...`)
    spawnSync(
      nodePackager,
      cmdParam.concat(Object.keys(electronDeps).map(dep => {
        return `${dep}@${electronDeps[dep]}`
      })),
      { cwd: appPaths.appDir, env: { ...process.env, NODE_ENV: 'development' } },
      () => warn('Failed to install Electron dependencies')
    )

    log(`Creating Electron source folder...`)
    fse.copySync(
      appPaths.resolve.cli('templates/electron'),
      appPaths.electronDir
    )

    log(`Electron support was added`)
  }

  remove () {
    if (!this.isInstalled) {
      warn(`No Electron support detected. Aborting.`)
      return
    }

    log(`Removing Electron source folder`)
    fse.removeSync(appPaths.electronDir)

    const cmdParam = nodePackager === 'npm'
      ? ['uninstall', '--save-dev']
      : ['remove']

    const deps = Object.keys(electronDeps)

    ;['packager', 'builder'].forEach(bundlerName => {
      if (bundlerIsInstalled(bundlerName)) {
        deps.push(`electron-${bundlerName}`)
      }
    })

    log(`Uninstalling Electron dependencies...`)
    spawnSync(
      nodePackager,
      cmdParam.concat(deps),
      { cwd: appPaths.appDir, env: { ...process.env, NODE_ENV: 'development' } },
      () => warn('Failed to uninstall Electron dependencies')
    )

    log(`Electron support was removed`)
  }
}

module.exports = Mode
