const fs = require('node:fs')
const fse = require('fs-extra')

const appPaths = require('../app-paths.js')
const { log, warn } = require('../utils/logger.js')
const { nodePackager } = require('../utils/node-packager.js')
const { hasTypescript } = require('../utils/has-typescript.js')
const { bundlerIsInstalled } = require('../electron/bundler.js')

const electronDeps = {
  electron: 'latest'
}

module.exports.QuasarMode = class QuasarMode {
  get isInstalled () {
    return fs.existsSync(appPaths.electronDir)
  }

  add () {
    if (this.isInstalled) {
      warn('Electron support detected already. Aborting.')
      return
    }

    nodePackager.installPackage(
      Object.entries(electronDeps).map(([ name, version ]) => `${ name }@${ version }`),
      { isDevDependency: true, displayName: 'Electron dependencies' }
    )

    log('Creating Electron source folder...')

    const format = hasTypescript ? 'ts' : 'default'
    fse.copySync(
      appPaths.resolve.cli(`templates/electron/${ format }`),
      appPaths.electronDir
    )

    fse.copySync(
      appPaths.resolve.cli('templates/electron/electron-flag.d.ts'),
      appPaths.resolve.electron('electron-flag.d.ts')
    )

    log('Creating Electron icons folder...')
    fse.copySync(
      appPaths.resolve.cli('templates/electron/icons'),
      appPaths.resolve.electron('icons')
    )

    log('Electron support was added')
  }

  remove () {
    if (!this.isInstalled) {
      warn('No Electron support detected. Aborting.')
      return
    }

    log('Removing Electron source folder')
    fse.removeSync(appPaths.electronDir)

    const deps = Object.keys(electronDeps)

    ;[ 'packager', 'builder' ].forEach(bundlerName => {
      if (bundlerIsInstalled(bundlerName)) {
        deps.push(`electron-${ bundlerName }`)
      }
    })

    nodePackager.uninstallPackage(deps, { displayName: 'Electron dependencies' })

    log('Electron support was removed')
  }
}
