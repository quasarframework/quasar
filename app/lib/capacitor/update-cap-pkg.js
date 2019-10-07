const fs = require('fs')
const appPaths = require('../app-paths')
const capacitorDeps = require('./capacitor-deps')

module.exports = function updateCapPkg (cfg) {
  const pkg = require(appPaths.resolve.app('package.json'))

  const capPkgPath = appPaths.resolve.capacitor('package.json')
  const capPkg = cfg === void 0 ? {} : require(capPkgPath)

  const propList = ['name', 'author']

  if (cfg === void 0) {
    propList.push('version', 'description')
  }

  propList.forEach(prop => {
    capPkg[prop] = pkg[prop]
  })

  if (cfg !== void 0) {
    capPkg.version = cfg.capacitor.version || pkg.version
    capPkg.description = cfg.capacitor.description || pkg.description
  }

  capPkg.private = true

  capPkg.dependencies = capPkg.dependencies || {}
  Object.assign(capPkg.dependencies, capacitorDeps)

  fs.writeFileSync(capPkgPath, JSON.stringify(capPkg, null, 2), 'utf-8')
}
