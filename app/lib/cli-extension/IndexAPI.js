const
  appPaths = require('../app-paths')

module.exports = class IndexAPI {
  constructor (opts) {
    this.opts = opts

    this.__hooks = {
      extendWebpack: [],
      chainWebpack: [],
      commands: []
    }
  }

  get resolve () {
    return appPaths.resolve
  }

  get appDir () {
    return appPaths.appDir
  }

  /**
   * Check if another app cli extension is installed
   *
   * @param {string} extId
   * @return {boolean} has the extension installed.
   */
  hasExtension (extId) {
    const extensionJson = require('./extension-json')
    return extensionJson.has(extId)
  }

  /**
   * Extend webpack config
   *
   * @param {function} fn
   *   (cfg: Object, ctx: Object) => undefined
   */
  extendWebpack (fn) {
    this.__hooks.extendWebpack.push(fn)
  }

  /**
   * Chain webpack config
   *
   * @param {function} fn
   *   (cfg: ChainObject, ctx: Object) => undefined
   */
  chainWebpack (fn) {
    this.__hooks.chainWebpack.push(fn)
  }

  /**
   * Register a command that will become available as `quasar run <cmd> [args]`.
   *
   * @param {string} name
   * @param {object} [opts]
   *   {
   *     description: string,
   *     usage: string,
   *     options: { [string]: string }
   *   }
   * @param {function} fn
   *   (argv: { [string name]: value }, rawArgs: string[]) => ?Promise
   */
  registerCommand (name, opts, fn) {
    this.__hooks.commands.push({ name, opts, fn })
  }

  /**
   * Private methods
   */

  __getHooks () {
    return this.__hooks
  }
}
