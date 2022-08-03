const fs = require('fs')
const appPaths = require('../app-paths')

module.exports = fs.existsSync(appPaths.resolve.app('tsconfig.json'))
