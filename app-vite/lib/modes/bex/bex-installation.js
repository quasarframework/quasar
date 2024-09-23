import fs from 'node:fs'
import fse from 'fs-extra'

import { log, warn } from '../../utils/logger.js'

export function isModeInstalled (appPaths) {
  return fs.existsSync(appPaths.bexDir)
}

export async function addMode ({
  ctx: { appPaths, cacheProxy },
  silent
}) {
  if (isModeInstalled(appPaths)) {
    if (silent !== true) {
      warn('Browser Extension support detected already. Aborting.')
    }
    return
  }

  console.log()
  log('Creating Browser Extension source folder...')

  fse.copySync(appPaths.resolve.cli('templates/bex/common'), appPaths.bexDir)

  const hasTypescript = await cacheProxy.getModule('hasTypescript')
  const format = hasTypescript ? 'ts' : 'default'
  fse.copySync(appPaths.resolve.cli(`templates/bex/${ format }`), appPaths.bexDir)

  log('Browser Extension support was added')
}

export async function removeMode ({
  ctx: { appPaths }
}) {
  if (!isModeInstalled(appPaths)) {
    warn('No Browser Extension support detected. Aborting.')
    return
  }

  log('Removing Browser Extension source folder')
  fse.removeSync(appPaths.bexDir)

  log('Browser Extension support was removed')
}
