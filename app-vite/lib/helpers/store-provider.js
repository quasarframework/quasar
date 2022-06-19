const getPackagePath = require('./get-package-path')
const nodePackager = require('./node-packager')

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

module.exports = getStoreProvider()
