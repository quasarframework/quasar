const path = require('path')

const appPaths = require('../app-paths')
const getPackagePath = require('../helpers/get-package-path')

// TODO - get path based on its package.json
module.exports = path.join(
  getPackagePath('@capacitor/cli', appPaths.capacitorDir),
  '../../bin/capacitor'
)
