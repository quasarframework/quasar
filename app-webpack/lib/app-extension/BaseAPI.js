
const appPaths = require('../app-paths.js')
const { appPkg } = require('../app-pkg.js')

module.exports.BaseAPI = class BaseAPI {
  engine = appPkg.name
  hasWebpack = true
  hasVite = false

  extId
  prompts
  resolve = appPaths.resolve
  appDir = appPaths.appDir

  __hooks = {}

  constructor ({ extId, prompts }) {
    this.extId = extId
    this.prompts = prompts
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
