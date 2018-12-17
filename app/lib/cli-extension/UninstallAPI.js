const
  appPaths = require('../app-paths')

module.exports = class UninstallAPI {
  constructor () {
    this.__hooks = {
      exitLog: []
    }
  }

  get appDir () {
    return appPaths.appDir
  }

  get resolve () {
    return appPaths.resolve
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
   * Remove a file or folder from the app on which the extension has been installed.
   *
   * @param {string} __path
   */
  removePath (__path) {
    //
  }

  /**
   * Add a message to be printed after App CLI finishes up install.
   *
   * @param {string} msg
   */
  onExitLog (msg) {
    this.__hooks.exitLog.push(msg)
  }

  /**
   * Private methods
   */

  __getHooks () {
    return this.__hooks
  }
}
