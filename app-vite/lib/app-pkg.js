
import { readFileSync } from 'node:fs'

import { getPackageJson } from './utils/get-package-json.js'
import appPaths from './app-paths.js'

const appPkgPath = appPaths.resolve.app('package.json')

function readAppPackageJson () {
  return JSON.parse(
    readFileSync(appPkgPath, 'utf-8')
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
