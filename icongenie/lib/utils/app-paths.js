import { existsSync } from 'node:fs'
import { join, normalize, sep } from 'node:path'

import { warn } from './logger.js'

function getAppInfo() {
  let appDir = process.cwd()

  while (appDir.length !== 0 && appDir.at(-1) !== sep) {
    if (
      existsSync(join(appDir, 'quasar.config.js')) ||
      existsSync(join(appDir, 'quasar.config.mjs')) ||
      existsSync(join(appDir, 'quasar.config.ts')) ||
      existsSync(join(appDir, 'quasar.config.cjs')) ||
      existsSync(join(appDir, 'quasar.conf.js')) // legacy
    ) {
      return appDir
    }

    appDir = normalize(join(appDir, '..'))
  }

  // no Quasar CLI project detected; Quasar might still be used as a
  // library (custom Vite/Electron setups), so target the current folder
  // instead of hard-failing -- only modes whose target folders actually
  // exist under it will get assets generated
  warn(
    'No Quasar project folder detected. Using the current folder as the target.'
  )
  return process.cwd()
}

export const appDir = getAppInfo()
export const resolveDir = dir => join(appDir, dir)
