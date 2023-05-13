const { getPackage } = require('./get-package.js')

const {
  generalAnimations,
  inAnimations,
  outAnimations
} = getPackage('@quasar/extras/animate/animate-list.common')

module.exports = generalAnimations.concat(inAnimations).concat(outAnimations)
