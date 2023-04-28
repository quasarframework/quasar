
import { existsSync } from 'node:fs'
import { normalize, join, sep } from 'node:path'

import { fatal } from './logger.js'

function getAppInfo () {
  let appDir = process.cwd()

  while (appDir.length && appDir[ appDir.length - 1 ] !== sep) {
    if (
      existsSync(join(appDir, 'quasar.config.js'))
      || existsSync(join(appDir, 'quasar.config.mjs'))
      || existsSync(join(appDir, 'quasar.config.ts'))
      || existsSync(join(appDir, 'quasar.config.cjs'))
      || existsSync(join(appDir, 'quasar.conf.js')) // legacy
    ) {
      return appDir
    }

    appDir = normalize(join(appDir, '..'))
  }

  fatal(`Error. This command must be executed inside a Quasar project folder.`)
}

export const appDir = getAppInfo()
export const resolveDir = dir => join(appDir, dir)
