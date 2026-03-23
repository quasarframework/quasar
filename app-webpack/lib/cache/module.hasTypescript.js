const { existsSync } = require('node:fs')

module.exports.createInstance = function createInstance({ appPaths }) {
  return existsSync(appPaths.resolve.app('tsconfig.json'))
}
