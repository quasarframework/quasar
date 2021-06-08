const fs = require('fs')
const fse = require('fs-extra')

const appPaths = require('../app-paths')
const { log, warn, fatal } = require('../helpers/logger')
const { spawnSync } = require('../helpers/spawn')
const nodePackager = require('../helpers/node-packager')
const { bundlerIsInstalled } = require('../electron/bundler')

const electronDeps = {
  'electron': 'latest'
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
      () => fatal('Failed to install Electron dependencies', 'FAIL')
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
      () => fatal('Failed to uninstall Electron dependencies', 'FAIL')
    )

    log(`Electron support was removed`)
  }
}

module.exports = Mode
