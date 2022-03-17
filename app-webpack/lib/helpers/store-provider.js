const getPackageJson = require('./get-package-json')
const nodePackager = require('./node-packager')

function getStoreProvider() {
  /** @type {'pinia' | 'vuex'} */
  const name = getPackageJson('vuex') !== void 0 ? 'vuex' : 'pinia'

  return {
    name,
    pathKey: name === 'pinia' ? 'stores' : 'store',

    isInstalled: getPackageJson(name) !== void 0,
    install () {
      nodePackager.installPackage(name)
    }
  }
}

module.exports = getStoreProvider()
