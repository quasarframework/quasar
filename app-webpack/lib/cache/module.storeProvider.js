const { getPackagePath } = require('../utils/get-package-path.js')

// Structured this way to be able to support other store providers in the future, if any
// We used to support Vuex, but it was dropped because it was deprecated long ago and had TypeScript issues
module.exports.createInstance = function createInstance({
  appPaths: { appDir },
  cacheProxy
}) {
  const name = 'pinia'

  return {
    name,
    pathKey: 'stores',

    isInstalled: getPackagePath(name, appDir) !== void 0,
    install() {
      const nodePackager = cacheProxy.getModule('nodePackager')
      nodePackager.installPackage(name)
    }
  }
}
