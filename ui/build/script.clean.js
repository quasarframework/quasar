const rimraf = require('rimraf')
const path = require('path')

rimraf.sync(path.resolve(__dirname, '../dist/*'))
console.log(' 💥 Cleaned build artifacts.\n')
