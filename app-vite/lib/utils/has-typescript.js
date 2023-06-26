import { existsSync } from 'node:fs'
import appPaths from '../app-paths.js'

export const hasTypescript = (
  appPaths.quasarConfigFilename.endsWith('.ts')
  && existsSync(appPaths.resolve.app('tsconfig.json'))
)
