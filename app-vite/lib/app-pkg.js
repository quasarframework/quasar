
import { readFileSync } from 'node:fs'

import { getPackageJson } from './utils/get-package-json.js'
import appPaths from './app-paths.js'

export const cliPkg = JSON.parse(
  readFileSync(
    new URL('../package.json', import.meta.url),
    'utf-8'
  )
)

export const appPkg = JSON.parse(
  readFileSync(
    appPaths.resolve.app('package.json'),
    'utf-8'
  )
)

export const quasarPkg = getPackageJson('quasar')
export const vitePkg = getPackageJson('vite')
