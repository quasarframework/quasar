import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

import { getPackagePath } from './get-package-path.js'

/**
 * Import a host package.
 */
export async function getPackage (pkgName, dir) {
  if (dir === void 0) {
    console.error('getPackage() -> dir param is required')
    process.exit(1)
  }

  try {
    const pkgPath = getPackagePath(pkgName, dir)
    return pkgPath.endsWith('.json') === true
      ? JSON.parse(readFileSync(pkgPath, 'utf-8'))
      : await import(pathToFileURL(pkgPath))
  }
  catch (_) {
    /* do and return nothing */
  }
}
