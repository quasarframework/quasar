import { createRequire } from 'node:module'
import appPaths from './app-paths.js'

const require = createRequire(import.meta.url)

/**
 * Get the resolved path of a host package.
 */
export function getPackagePath (pkgName, folder = appPaths.appDir) {
  try {
    return require.resolve(pkgName, {
      paths: [ folder ]
    })
  }
  catch (_) {
    /* do and return nothing */
  }
}
