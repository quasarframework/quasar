import { createRequire } from 'node:module'
import { resolvePathSync } from 'mlly'

/**
 * Eventually replace by the native import.meta.resolve() method
 * when it is out of "experimental" status with no node flags required.
 */
const require = createRequire(import.meta.url)

/**
 * Get the resolved path of a host package.
 */
export function getPackagePath(pkgName, dir) {
  if (dir === void 0) {
    console.error('getPackagePath() -> dir param is required')
    process.exit(1)
  }

  try {
    return resolvePathSync(pkgName, { url: dir })
  } catch {
    /* do nothing, let the next method try as well */
  }

  try {
    return require.resolve(pkgName, {
      paths: [dir]
    })
  } catch {
    /* do and return nothing */
  }
}
