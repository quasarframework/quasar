const { dirname } = require('node:path')

const { getPackagePath } = require('../utils/get-package-path.js')

module.exports.createInstance = function createInstance ({ appPaths }) {
  const ePath = getPackagePath('@quasar/extras', appPaths.appDir)
  return ePath !== void 0
    ? dirname(ePath)
    : false
}
