
const appPaths = require('../app-paths')
const { name } = require('../../package.json')

module.exports = class ApiBase {
  engine = name
  hasWebpack = false
  hasVite = true

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
    this.__hooks[name].push({ fn, api: this })
  }
}
