import fse from 'fs-extra'

import { log, warn } from '../../utils/logger.js'
import { isModeInstalled } from '../modes-utils.js'

/**
 * @param {{
 *   ctx: import('../../../types/configuration/context').InternalQuasarContext,
 *   silent: boolean
 * }} options
 */
export async function addMode({ ctx: { appPaths, cacheProxy }, silent }) {
  if (isModeInstalled(appPaths, 'bex')) {
    if (silent !== true) {
      warn('Browser Extension support detected already. Aborting.')
    }
    return
  }

  console.log()
  log('Creating Browser Extension source folder...')

  fse.copySync(appPaths.resolve.cli('templates/bex/common'), appPaths.bexDir)

  const hasTypescript = await cacheProxy.getModule('hasTypescript')
  const format = hasTypescript ? 'ts' : 'js'
  fse.copySync(appPaths.resolve.cli(`templates/bex/${format}`), appPaths.bexDir)

  log('Browser Extension support was added')
}

/**
 * @param {{
 *   ctx: import('../../../types/configuration/context').InternalQuasarContext,
 * }} options
 */
export function removeMode({ ctx: { appPaths } }) {
  if (isModeInstalled(appPaths, 'bex') === false) {
    warn('No Browser Extension support detected. Aborting.')
    return
  }

  log('Removing Browser Extension source folder')
  fse.removeSync(appPaths.bexDir)

  log('Browser Extension support was removed')
}
