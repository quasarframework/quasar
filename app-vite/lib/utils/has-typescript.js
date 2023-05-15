const { existsSync } = require('node:fs')
const appPaths = require('../app-paths.js')

module.exports.hasTypescript = (
  appPaths.quasarConfigFilename.endsWith('.ts')
  || existsSync(appPaths.resolve.app('tsconfig.json'))
)
