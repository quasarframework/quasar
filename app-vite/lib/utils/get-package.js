
import { readFileSync } from 'node:fs'

import appPaths from '../app-paths.js'
import { getPackagePath } from './get-package-path.js'

/**
 * Import a host package.
 */
export async function getPackage (pkgName, folder = appPaths.appDir) {
  try {
    const pkgPath = getPackagePath(pkgName, folder)
    return pkgPath.endsWith('.json') === true
      ? JSON.parse(readFileSync(pkgPath, 'utf-8'))
      : await import(pkgPath)
  }
  catch (e) {}
}
