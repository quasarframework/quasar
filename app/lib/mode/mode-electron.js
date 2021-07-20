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

    log(`Creating Electron icons folder...`)
    fse.moveSync(
      appPaths.resolve.electron("icons-electron"),
      appPaths.resolve.public("icons-electron")
    )

    log(`Adding "main" to package.json...`)
    const data = fse.readFileSync(appPaths.resolve.app("package.json"))
    let json = JSON.parse(data)
    json["main"] = ".quasar/electron/electron-main.js"
    fse.writeFileSync(appPaths.resolve.app("package.json"), JSON.stringify(json, null, 2))

    log(`Electron support was added`)
  }

  remove () {
    if (!this.isInstalled) {
      warn(`No Electron support detected. Aborting.`)
      return
    }

    log(`Removing Electron source folder`)
    fse.removeSync(appPaths.electronDir)

    log(`Removing Electron icons folder`)
    fse.removeSync(appPaths.resolve.public("icons-electron"))

    log(`Removing "main" from package.json...`)
    const data = fse.readFileSync(appPaths.resolve.app("package.json"))
    let json = JSON.parse(data)
    delete json["main"]
    fse.writeFileSync(appPaths.resolve.app("package.json"), JSON.stringify(json, null, 2))

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
