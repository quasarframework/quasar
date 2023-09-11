
const appPaths = require('../app-paths')
const { name } = require('../../package.json')

module.exports = class BaseAPI {
  engine = name
  hasWebpack = false
  hasVite = true

  extId
  resolve = appPaths.resolve
  appDir = appPaths.appDir

  __hooks = {}
  __storePackage = null

  constructor ({ extId }) {
    this.extId = extId
  }

  hasTypescript () {
    return require('../helpers/has-typescript') === true
  }

  hasLint () {
    const { hasEslint } = require('../helpers/has-eslint')
    return hasEslint === true
  }

  getStorePackageName () {
    if (this.__storePackage !== null) {
      return this.__storePackage
    }

    const getPackagePath = require('../helpers/get-package-path')

    if (getPackagePath('vuex') !== void 0) {
      this.__storePackage = 'vuex'
      return 'vuex'
    }

    if (getPackagePath('pinia') !== void 0) {
      this.__storePackage = 'pinia'
      return 'pinia'
    }

    this.__storePackage = void 0
  }

  getNodePackagerName () {
    return require('../helpers/node-packager').name
  }

  /**
   * Private-ish methods
   */

  __getHooks () {
    return this.__hooks
  }

  __addHook (name, fn) {
    this.__hooks[ name ].push({ fn, api: this })
  }
}
