import fse from 'fs-extra'

import { log, warn } from '../../utils/logger.js'
import { isModeInstalled } from '../modes-utils.js'

const electronDeps = {
  electron: 'latest'
}

/**
 * @param {{
 *   ctx: import('../../../types/configuration/context').InternalQuasarContext,
 *   silent: boolean
 * }} options
 */
export async function addMode ({
  ctx: { appPaths, cacheProxy },
  silent
}) {
  if (isModeInstalled(appPaths, 'electron')) {
    if (silent !== true) {
      warn('Electron support detected already. Aborting.')
    }
    return
  }

  const nodePackager = await cacheProxy.getModule('nodePackager')
  nodePackager.installPackage(
    Object.entries(electronDeps).map(([ name, version ]) => `${ name }@${ version }`),
    { isDevDependency: true, displayName: 'Electron dependencies' }
  )

  log('Creating Electron source folder...')
  const hasTypescript = await cacheProxy.getModule('hasTypescript')
  const format = hasTypescript ? 'ts' : 'js'
  fse.copySync(
    appPaths.resolve.cli(`templates/electron/${ format }`),
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
export async function removeMode ({
  ctx: { appPaths, cacheProxy }
}) {
  if (isModeInstalled(appPaths, 'electron') === false) {
    warn('No Electron support detected. Aborting.')
    return
  }

  log('Removing Electron source folder')
  fse.removeSync(appPaths.electronDir)

  const deps = Object.keys(electronDeps)

  const { bundlerIsInstalled } = await cacheProxy.getModule('electron')
  ;[ 'packager', 'builder' ].forEach(bundlerName => {
    if (bundlerIsInstalled(bundlerName)) {
      deps.push(`electron-${ bundlerName }`)
    }
  })

  const nodePackager = await cacheProxy.getModule('nodePackager')
  nodePackager.uninstallPackage(deps, { displayName: 'Electron dependencies' })

  log('Electron support was removed')
}
