const { getPackage } = require('../utils/get-package.js')

module.exports.createInstance = function createInstance ({ appPaths }) {
  const {
    generalAnimations,
    inAnimations,
    outAnimations
  } = getPackage('@quasar/extras/animate/animate-list.common', appPaths.appDir)

  return generalAnimations.concat(inAnimations).concat(outAnimations)
}
