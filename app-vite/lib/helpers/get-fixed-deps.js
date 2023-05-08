const getPackageJson = require('./get-package-json')

const urlRangePattern = /^[a-zA-Z]/

/**
 * @param {{ [key: string]: string }} deps package.json > dependencies
 * @returns {{ [key: string]: string }} deps with their name mapped to exact versions
 *
 * @example
 * ```
 * getFixedDeps({ 'quasar': '^2.0.0', 'whatever': 'https://some.url' })
 * // { 'quasar': '2.7.1', 'whatever': 'https://some.url' }
 * ```
 */
module.exports = function getFixedDeps (deps) {
  if (!deps) {
    return {}
  }

  const appDeps = { ...deps }

  Object.entries(deps).forEach(([ name, versionRange ]) => {
    if (urlRangePattern.test(versionRange)) {
      return
    }

    const pkg = getPackageJson(name)
    appDeps[ name ] = pkg !== void 0 ? pkg.version : versionRange
  })

  return appDeps
}
