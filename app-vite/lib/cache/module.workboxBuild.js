import { getPackage } from '../utils/get-package.js'

export async function createInstance ({ appPaths }) {
  return await getPackage('workbox-build', appPaths.appDir)
}
