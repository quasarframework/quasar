const { getPackage } = require('../utils/get-package.js')

module.exports.createInstance = function createInstance ({ appPaths }) {
  return getPackage('workbox-webpack-plugin', appPaths.appDir)
}
