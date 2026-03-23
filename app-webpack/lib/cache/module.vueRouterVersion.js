const {
  getPackageMajorVersion
} = require('../utils/get-package-major-version.js')

module.exports.createInstance = function createInstance({
  appPaths: { appDir }
}) {
  return getPackageMajorVersion('vue-router', appDir)
}
