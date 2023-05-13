const { getPackagePath } = require('./get-package-path.js')
const { nodePackager } = require('./node-packager.js')

function getStoreProvider () {
  /** @type {'pinia' | 'vuex'} */
  const name = getPackagePath('vuex') !== void 0 ? 'vuex' : 'pinia'

  return {
    name,
    pathKey: name === 'pinia' ? 'stores' : 'store',

    isInstalled: getPackagePath(name) !== void 0,
    install () {
      nodePackager.installPackage(name)
    }
  }
}

module.exports.storeProvider = getStoreProvider()
