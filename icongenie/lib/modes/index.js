
import { existsSync } from 'node:fs'
import { resolveDir } from '../utils/app-paths.js'

const { modes } = existsSync(resolveDir('public'))
  ? await import('./quasar-app-v2/index.js')
  : await import('./quasar-app-v1/index.js')

export { modes }
