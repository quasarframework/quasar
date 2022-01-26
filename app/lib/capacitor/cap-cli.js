const path = require('path')

const appPaths = require('../app-paths')
const getPackagePath = require('../helpers/get-package-path')
const getPackageMajorVersion = require('../helpers/get-package-major-version')

module.exports.capBin = path.join(
  getPackagePath('@capacitor/cli', appPaths.capacitorDir),
  '../../bin/capacitor'
)

module.exports.capVersion = getPackageMajorVersion('@capacitor/cli', appPaths.capacitorDir)
