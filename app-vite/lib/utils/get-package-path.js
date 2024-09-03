import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/**
 * Get the resolved path of a host package.
 */
export function getPackagePath (pkgName, dir) {
  if (dir === void 0) {
    console.error('getPackagePath() -> dir param is required')
    process.exit(1)
  }

  try {
    return require.resolve(pkgName, {
      paths: [ dir ]
    })
  }
  catch (_) {
    /* do and return nothing */
  }
}
