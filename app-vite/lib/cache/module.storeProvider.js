import { getPackagePath } from '../utils/get-package-path.js'

// Structured this way to be able to support other store providers in the future, if any
// We used to support Vuex, but it was dropped because it was deprecated long ago and had TypeScript issues
export function createInstance({ appPaths: { appDir }, cacheProxy }) {
  const name = 'pinia'

  return {
    name,
    pathKey: 'stores',

    isInstalled: getPackagePath(name, appDir) !== void 0,
    async install() {
      const nodePackager = await cacheProxy.getModule('nodePackager')
      nodePackager.installPackage(name)
    }
  }
}
