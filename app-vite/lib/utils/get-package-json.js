import { readFileSync } from 'node:fs'

import { getPackagePath } from './get-package-path.js'

/**
 * Get package.json of a host package.
 * Don't use it for direct dependencies of this project.
 */
export function getPackageJson (pkgName, dir) {
  if (dir === void 0) {
    console.error('getPackageJson() -> dir param is required')
    process.exit(1)
  }

  try {
    return JSON.parse(
      readFileSync(
        getPackagePath(`${ pkgName }/package.json`, dir),
        'utf-8'
      )
    )
  }
  catch (_) {
    /* do and return nothing */
  }
}
