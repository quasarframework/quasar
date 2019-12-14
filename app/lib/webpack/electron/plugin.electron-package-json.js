const appPaths = require('../../app-paths')
const getFixedDeps = require('../../helpers/get-fixed-deps')

module.exports = class ElectronPackageJson {
  apply (compiler) {
    compiler.hooks.emit.tapAsync('package.json', (compiler, callback) => {
      const pkg = require(appPaths.resolve.app('package.json'))

      if (pkg.dependencies) {
        pkg.dependencies = getFixedDeps(pkg.dependencies)
      }

      // we don't need this (also, faster install time & smaller bundles)
      delete pkg.devDependencies

      pkg.main = './electron-main.js'
      const source = JSON.stringify(pkg)

      compiler.assets['package.json'] = {
        source: () => Buffer.from(source, 'utf8'),
        size: () => Buffer.byteLength(source)
      }

      callback()
    })
  }
}
