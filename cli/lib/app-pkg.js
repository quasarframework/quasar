import { readFileSync } from 'node:fs'

import appPaths from './app-paths.js'

export const appPkg = JSON.parse(
  readFileSync(appPaths.resolve.app('package.json'), 'utf8')
)
