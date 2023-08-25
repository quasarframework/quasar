const { getPackagePath } = require('../utils/get-package-path.js')

module.exports.createInstance = function createInstance ({
  appPaths: { appDir },
  cacheProxy
}) {
  /** @type {'pinia' | 'vuex'} */
  const name = getPackagePath('vuex', appDir) !== void 0 ? 'vuex' : 'pinia'

  return {
    name,
    pathKey: name === 'pinia' ? 'stores' : 'store',

    isInstalled: getPackagePath(name, appDir) !== void 0,
    install () {
      const nodePackager = cacheProxy.getModule('nodePackager')
      nodePackager.installPackage(name)
    }
  }
}
