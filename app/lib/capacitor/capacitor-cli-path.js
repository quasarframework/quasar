const path = require('path')

const appPaths = require('../app-paths')
const getPackagePath = require('../helpers/get-package-path')

module.exports = path.join(
  getPackagePath('@capacitor/cli', appPaths.capacitorDir),
  '../../bin/capacitor'
)
