import { getPackage } from './get-package.js'

const {
  generalAnimations,
  inAnimations,
  outAnimations
} = await getPackage('@quasar/extras/animate/animate-list.common')

export default generalAnimations.concat(inAnimations).concat(outAnimations)
