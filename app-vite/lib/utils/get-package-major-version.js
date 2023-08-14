import { getPackageJson } from './get-package-json.js'

function getMajorVersion (version) {
  const matches = version.match(/^(\d)\./)
  return parseInt(matches[ 1 ], 10)
}

/**
 * Get major version of a host package.
 */
export function getPackageMajorVersion (pkgName, dir) {
  if (dir === void 0) {
    console.error('getPackageMajorVersion() -> dir param is required')
    process.exit(1)
  }

  const pkg = getPackageJson(pkgName, dir)

  if (pkg) {
    return getMajorVersion(pkg.version)
  }
}
