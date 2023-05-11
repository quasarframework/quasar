const fs = require('node:fs')
const appPaths = require('../app-paths.js')

module.exports = fs.existsSync(appPaths.resolve.app('tsconfig.json'))
