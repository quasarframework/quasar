
import fs from 'node:fs'
import fse from 'fs-extra'

import appPaths from '../../app-paths.js'
import { log, warn } from '../../utils/logger.js'
import { hasTypescript } from '../../utils/has-typescript.js'

export function isModeInstalled () {
  return fs.existsSync(appPaths.ssrDir)
}

export function addMode (silent) {
  if (isModeInstalled()) {
    if (silent !== true) {
      warn('SSR support detected already. Aborting.')
    }
    return
  }

  log('Creating SSR source folder...')

  const format = hasTypescript ? 'ts' : 'default'
  fse.copySync(
    appPaths.resolve.cli(`templates/ssr/${ format }`),
    appPaths.ssrDir
  )

  fse.copySync(
    appPaths.resolve.cli('templates/ssr/ssr-flag.d.ts'),
    appPaths.resolve.ssr('ssr-flag.d.ts')
  )

  log('SSR support was added')
}

export function removeMode () {
  if (!isModeInstalled()) {
    warn('No SSR support detected. Aborting.')
    return
  }

  log('Removing SSR source folder')
  fse.removeSync(appPaths.ssrDir)
  log('SSR support was removed')
}
