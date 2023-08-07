import { readFileSync } from 'node:fs'

import appPaths from './app-paths.js'
import { getPackagePath } from './get-package-path.js'

/**
 * Get package.json of a host package.
 * Don't use it for direct dependencies of this project.
 */
export function getPackageJson (pkgName, folder = appPaths.appDir) {
  try {
    return JSON.parse(
      readFileSync(
        getPackagePath(`${ pkgName }/package.json`, folder),
        'utf-8'
      )
    )
  }
  catch (_) {
    /* do and return nothing */
  }
}
