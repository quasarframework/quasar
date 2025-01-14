import { readFileSync, statSync } from 'node:fs'

import { warning } from './logger.js'
import { getPackageJson } from '../utils/get-package-json.js'
import { parseJSON } from 'confbox'

export function getPkg (appPaths) {
  const { appDir, cliDir } = appPaths
  const appPkgPath = appPaths.resolve.app('package.json')

  let appPkg = {}
  let lastAppPkgModifiedTime = 0

  function getAppPackageJson () {
    const { mtime } = statSync(appPkgPath)

    if (mtime !== lastAppPkgModifiedTime) {
      lastAppPkgModifiedTime = mtime
      try {
        // This may get updated and written, so use parseJSON to preserve formatting
        appPkg = parseJSON(
          readFileSync(appPkgPath, 'utf-8')
        )
      }
      catch (err) {
        warning('Could not parse app\'s package.json. The file is malformed:')
        console.error(err)
      }
    }

    return appPkg
  }

  const acc = {
    quasarPkg: getPackageJson('quasar', appDir),
    vitePkg: (
      getPackageJson('vite', appDir)
      || getPackageJson('vite', cliDir)
    )
  }

  Object.defineProperty(acc, 'appPkg', { get: getAppPackageJson })

  return acc
}
