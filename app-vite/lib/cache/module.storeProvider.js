import { getPackagePath } from '../utils/get-package-path.js'

export async function createInstance ({
  appPaths: { appDir },
  cacheProxy
}) {
  /** @type {'pinia' | 'vuex'} */
  const name = getPackagePath('vuex', appDir) !== void 0 ? 'vuex' : 'pinia'

  return {
    name,
    pathKey: name === 'pinia' ? 'stores' : 'store',

    isInstalled: getPackagePath(name, appDir) !== void 0,
    async install () {
      const nodePackager = await cacheProxy.getModule('nodePackager')
      nodePackager.installPackage(name)
    }
  }
}
