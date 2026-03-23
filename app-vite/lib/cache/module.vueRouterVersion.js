import { getPackageMajorVersion } from '../utils/get-package-major-version.js'

export function createInstance({ appPaths: { appDir } }) {
  return getPackageMajorVersion('vue-router', appDir)
}
