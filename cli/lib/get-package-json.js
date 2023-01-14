import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export function getPackageJson (root) {
  return function (pkgName) {
    try {
      return require(
        require.resolve(`${pkgName}/package.json`, {
          paths: [ root ]
        })
      )
    }
    catch (e) {}
  }
}
