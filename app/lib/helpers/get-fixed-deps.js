const getPackageJson = require('./get-package-json')

module.exports = function (deps) {
  if (!deps) {
    return {}
  }

  const appDeps = { ...deps }

  Object.keys(deps).forEach(name => {
    const pkg = getPackageJson(name)
    appDeps[name] = pkg ? pkg.version : deps[name]
  })

  return appDeps
}
