
import { readFileSync } from 'node:fs'

import { getPackageJson } from './utils/get-package-json.js'
import appPaths from './app-paths.js'

function readAppPackageJson () {
  return JSON.parse(
    readFileSync(
      appPaths.resolve.app('package.json'),
      'utf-8'
    )
  )
}

export const cliPkg = JSON.parse(
  readFileSync(
    new URL('../package.json', import.meta.url),
    'utf-8'
  )
)

export let appPkg = readAppPackageJson()
export function updateAppPackageJson () {
  appPkg = readAppPackageJson()
}

export const quasarPkg = getPackageJson('quasar')
export const vitePkg = getPackageJson('vite')
