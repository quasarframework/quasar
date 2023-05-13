const fs = require('node:fs')
const appPaths = require('../app-paths.js')

module.exports.hasTypescript = fs.existsSync(appPaths.resolve.app('tsconfig.json'))
