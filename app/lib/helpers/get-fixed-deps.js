const getPackageJson = require('./get-package-json')

module.exports = function (deps) {
  if (!deps) {
    return {}
  }

  const appDeps = { ...deps }

  Object.keys(deps).forEach(name => {
    // is it a URL?
    if (/^[a-zA-Z]/.test(deps[name])) {
      appDeps[name] = deps[name]
    }
    else {
      const pkg = getPackageJson(name)
      appDeps[name] = pkg !== void 0 ? pkg.version : deps[name]
    }
  })

  return appDeps
}
