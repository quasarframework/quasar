const appPaths = require('../../app-paths')
const getPackagePath = require('../../helpers/get-package-path')
const getPackageMajorVersion = require('../../helpers/get-package-major-version')

module.exports.capBin = getPackagePath('@capacitor/cli/bin/capacitor', appPaths.capacitorDir)

module.exports.capVersion = getPackageMajorVersion('@capacitor/cli', appPaths.capacitorDir)
