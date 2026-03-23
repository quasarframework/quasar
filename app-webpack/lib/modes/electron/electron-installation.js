const fse = require('fs-extra')

const { log, warn } = require('../../utils/logger.js')
const { isModeInstalled } = require('../modes-utils.js')

const electronDeps = {
  electron: 'latest'
}

/**
 * @param {{
 *   ctx: import('../../../types/configuration/context').InternalQuasarContext,
 *   silent: boolean
 * }} options
 */
module.exports.addMode = function addMode({
  ctx: { appPaths, cacheProxy },
  silent
}) {
  if (isModeInstalled(appPaths, 'electron')) {
    if (silent !== true) {
      warn('Electron support detected already. Aborting.')
    }
    return
  }

  const nodePackager = cacheProxy.getModule('nodePackager')
  nodePackager.installPackage(
    Object.entries(electronDeps).map(([name, version]) => `${name}@${version}`),
    { isDevDependency: true, displayName: 'Electron dependencies' }
  )

  log('Creating Electron source folder...')
  const hasTypescript = cacheProxy.getModule('hasTypescript')
  const format = hasTypescript ? 'ts' : 'js'
  fse.copySync(
    appPaths.resolve.cli(`templates/electron/${format}`),
    appPaths.electronDir
  )

  log('Creating Electron icons folder...')
  fse.copySync(
    appPaths.resolve.cli('templates/electron/icons'),
    appPaths.resolve.electron('icons')
  )

  log('Electron support was added')
}

/**
 * @param {{
 *   ctx: import('../../../types/configuration/context').InternalQuasarContext,
 * }} options
 */
module.exports.removeMode = function removeMode({
  ctx: { appPaths, cacheProxy }
}) {
  if (isModeInstalled(appPaths, 'electron') === false) {
    warn('No Electron support detected. Aborting.')
    return
  }

  log('Removing Electron source folder')
  fse.removeSync(appPaths.electronDir)

  const deps = Object.keys(electronDeps)

  const { bundlerIsInstalled } = cacheProxy.getModule('electron')
  ;['packager', 'builder'].forEach(bundlerName => {
    if (bundlerIsInstalled(bundlerName)) {
      deps.push(`electron-${bundlerName}`)
    }
  })

  const nodePackager = cacheProxy.getModule('nodePackager')
  nodePackager.uninstallPackage(deps, { displayName: 'Electron dependencies' })

  log('Electron support was removed')
}
