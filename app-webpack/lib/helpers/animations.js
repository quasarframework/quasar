const getPackage = require('./get-package')

const {
  generalAnimations,
  inAnimations,
  outAnimations
} = getPackage('@quasar/extras/animate/animate-list.common')

module.exports = generalAnimations.concat(inAnimations).concat(outAnimations)
