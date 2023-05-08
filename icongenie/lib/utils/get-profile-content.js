
import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'

import { warn } from './logger.js'
import { appDir } from './app-paths.js'

export function getProfileContent (profileFile) {
  const file = resolve(appDir, profileFile)

  try {
    return JSON.parse(
      readFileSync(file, 'utf-8')
    )
  }
  catch (err) {
    warn(`Specified profile file has a syntax error`)
    console.error(err)
    process.exit(1)
  }
}
