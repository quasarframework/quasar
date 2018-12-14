const
  appPaths = require('../../app-paths')

module.exports = class ElectronPackageJson {
  apply (compiler) {
    compiler.hooks.emit.tapAsync('package.json', (compiler, callback) => {
      const pkg = require(appPaths.resolve.app('package.json'))

      // we don't need this (also, faster install time & smaller bundles)
      delete pkg.devDependencies

      pkg.main = './electron-main.js'
      const source = JSON.stringify(pkg)

      compiler.assets['package.json'] = {
        source: () => new Buffer(source),
        size: () => Buffer.byteLength(source)
      }

      callback()
    })
  }
}
