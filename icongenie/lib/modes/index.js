const { existsSync } = require('fs')
const { resolveDir } = require('../utils/app-paths')

module.exports = existsSync(resolveDir('public'))
  ? require('./quasar-app-v2')
  : require('./quasar-app-v1')
