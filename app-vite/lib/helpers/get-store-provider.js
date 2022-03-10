const getPackageJson = require("./get-package-json")

module.exports = function getStoreProvider() {
  /** @type {'pinia' | 'vuex'} */
  const name = getPackageJson('vuex') !== void 0 ? 'vuex' : 'pinia'

  return {
    name,
    pathKey: name === 'pinia' ? 'stores' : 'store',

    isInstalled: getPackageJson(name) !== void 0
  }
}
