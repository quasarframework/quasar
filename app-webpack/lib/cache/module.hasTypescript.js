const { existsSync } = require('node:fs')

module.exports.createInstance = function createInstance ({ appPaths }) {
  return (
    appPaths.quasarConfigFilename.endsWith('.ts')
    && existsSync(appPaths.resolve.app('tsconfig.json'))
  )
}
