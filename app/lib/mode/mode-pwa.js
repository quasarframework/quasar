const fs = require('fs')
const fse = require('fs-extra')

const appPaths = require('../app-paths')
const { log, warn, fatal } = require('../helpers/logger')
const { spawnSync } = require('../helpers/spawn')
const nodePackager = require('../helpers/node-packager')

const pwaDeps = {
  'workbox-webpack-plugin': '^6.0.0'
}

class Mode {
  get isInstalled () {
    return fs.existsSync(appPaths.pwaDir)
  }

  add () {
    if (this.isInstalled) {
      warn(`PWA support detected already. Aborting.`)
      return
    }

    const cmdParam = nodePackager === 'npm'
      ? ['install', '--save-dev']
      : ['add', '--dev']

    log(`Installing PWA dependencies...`)
    spawnSync(
      nodePackager,
      cmdParam.concat(Object.keys(pwaDeps).map(dep => {
        return `${dep}@${pwaDeps[dep]}`
      })),
      { cwd: appPaths.appDir, env: { ...process.env, NODE_ENV: 'development' } },
      () => fatal('Failed to install PWA dependencies', 'FAIL')
    )

    log(`Creating PWA source folder...`)
    fse.copySync(appPaths.resolve.cli('templates/pwa'), appPaths.pwaDir)

    log(`Copying PWA icons to /public/icons/ (if they are not already there)...`)
    fse.copySync(
      appPaths.resolve.cli('templates/pwa-icons'),
      appPaths.resolve.app('public/icons'),
      { overwrite: false }
    )

    log(`PWA support was added`)
  }

  remove () {
    if (!this.isInstalled) {
      warn(`No PWA support detected. Aborting.`)
      return
    }

    log(`Removing PWA source folder`)
    fse.removeSync(appPaths.pwaDir)

    const cmdParam = nodePackager === 'npm'
      ? ['uninstall', '--save-dev']
      : ['remove']

    const deps = Object.keys(pwaDeps)

    log(`Uninstalling PWA dependencies...`)
    spawnSync(
      nodePackager,
      cmdParam.concat(deps),
      { cwd: appPaths.appDir, env: { ...process.env, NODE_ENV: 'development' } },
      () => fatal('Failed to uninstall PWA dependencies', 'FAIL')
    )

    log(`PWA support was removed`)
  }
}

module.exports = Mode
