import { existsSync } from 'node:fs'
import { sep, normalize, join } from 'node:path'

export function getProjectRoot () {
  let dir = process.cwd()

  while (dir.length && dir[ dir.length - 1 ] !== sep) {
    if (
      existsSync(join(dir, 'quasar.config.js'))
      || existsSync(join(dir, 'quasar.config.mjs'))
      || existsSync(join(dir, 'quasar.config.ts'))
      || existsSync(join(dir, 'quasar.config.cjs'))
      || existsSync(join(dir, 'quasar.conf.js')) // legacy
    ) {
      return dir
    }

    dir = normalize(join(dir, '..'))
  }
}
