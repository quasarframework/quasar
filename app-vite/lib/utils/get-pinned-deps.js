import { getPackageJson } from './get-package-json.js'

const urlRangePattern = /^[a-zA-Z]/

/**
 * @param {{ [key: string]: string }} deps package.json > dependencies
 * @returns {{ [key: string]: string }} deps with their name mapped to exact versions
 *
 * @example
 * ```
 * getPinnedDeps({ 'quasar': '^2.0.0', 'whatever': 'https://some.url' })
 * // { 'quasar': '2.7.1', 'whatever': 'https://some.url' }
 * ```
 */
export function getPinnedDeps(deps, rootDir) {
  if (!deps) return {}

  const appDeps = { ...deps }

  Object.entries(deps).forEach(([name, versionRange]) => {
    // The workspace protocol only resolves inside the app's own monorepo,
    // so it must not survive into a generated dist package.json —
    // pin it to the installed version like any other resolvable range
    // (the urlRangePattern below would otherwise skip it)
    if (versionRange.startsWith('workspace:')) {
      const pkg = getPackageJson(name, rootDir)
      if (pkg !== void 0) {
        appDeps[name] = pkg.version
      }
      return
    }

    if (urlRangePattern.test(versionRange)) return

    const pkg = getPackageJson(name, rootDir)
    appDeps[name] = pkg !== void 0 ? pkg.version : versionRange
  })

  return appDeps
}
