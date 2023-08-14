import { getPackage } from '../utils/get-package.js'

export async function createInstance ({ appPaths }) {
  const {
    generalAnimations,
    inAnimations,
    outAnimations
  } = await getPackage('@quasar/extras/animate/animate-list.common', appPaths.appDir)

  return generalAnimations.concat(inAnimations).concat(outAnimations)
}
