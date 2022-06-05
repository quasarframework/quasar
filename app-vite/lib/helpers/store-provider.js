const getPackage = require('./get-package')
const nodePackager = require('./node-packager')

function getStoreProvider () {
  /** @type {'pinia' | 'vuex'} */
  const name = getPackage('vuex') !== void 0 ? 'vuex' : 'pinia'

  return {
    name,
    pathKey: name === 'pinia' ? 'stores' : 'store',

    isInstalled: getPackage(name) !== void 0,
    install () {
      nodePackager.installPackage(name)
    }
  }
}

module.exports = getStoreProvider()
