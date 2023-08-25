const { getPackagePath } = require('../utils/get-package-path.js')
const { getPackageMajorVersion } = require('../utils/get-package-major-version.js')

module.exports.createInstance = function createInstance ({
  appPaths: { capacitorDir }
}) {
  return {
    capBin: getPackagePath('@capacitor/cli/bin/capacitor', capacitorDir),
    capVersion: getPackageMajorVersion('@capacitor/cli', capacitorDir)
  }
}
