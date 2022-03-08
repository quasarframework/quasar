const {
  generalAnimations,
  inAnimations,
  outAnimations
} = require('@quasar/extras/animate/animate-list.common')

module.exports = generalAnimations.concat(inAnimations).concat(outAnimations)
