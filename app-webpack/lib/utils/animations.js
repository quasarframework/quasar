const { getPackage } = require('./get-package.js')

const {
  generalAnimations,
  inAnimations,
  outAnimations
} = getPackage('@quasar/extras/animate/animate-list.common')

module.exports.animations = generalAnimations.concat(inAnimations).concat(outAnimations)
