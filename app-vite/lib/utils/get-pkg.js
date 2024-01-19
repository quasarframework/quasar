import { readFileSync } from 'node:fs'

import { getPackageJson } from '../utils/get-package-json.js'

export function getPkg (appPaths) {
  const { appDir } = appPaths
  const appPkgPath = appPaths.resolve.app('package.json')

  function readAppPackageJson () {
    return JSON.parse(
      readFileSync(appPkgPath, 'utf-8')
    )
  }

  const acc = {
    appPkg: readAppPackageJson(),
    updateAppPackageJson () {
      acc.appPkg = readAppPackageJson()
    },
    quasarPkg: getPackageJson('quasar', appDir),
    vitePkg: getPackageJson('vite', appDir)
  }

  return acc
}
