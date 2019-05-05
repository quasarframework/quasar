const
  appPaths = require('../app-paths'),
  { removeSync } = require('fs-extra')

const
  { spawnAE } = require('../helpers/spawn')

/**
 * API for extension's /uninstall.js script
 */
module.exports = class UninstallAPI {
  constructor ({ extId, prompts }) {
    this.extId = extId
    this.prompts = prompts
    this.resolve = appPaths.resolve
    this.appDir = appPaths.appDir

    this.__hooks = {
      exitLog: []
    }
  }

  /**
   * Check if another app extension is installed
   *
   * @param {string} extId
   * @return {boolean} has the extension installed.
   */
  hasExtension (extId) {
    const extensionJson = require('./extension-json')
    return extensionJson.has(extId)
  }

  /**
   * Remove a file or folder from devland which the
   * extension has installed and is no longer needed.
   *
   * Be careful about it and do not delete the files
   * that would break developer's app.
   *
   * The __path (file or folder) needs to be relative
   * to project's root folder.
   *
   * @param {string} __path
   */
  removePath (__path) {
    removeSync(appPaths.resolve.app(__path))
  }

  /**
   * Spawn a process synchronously.
   *
   * @param {object} params (cmd: String, params: Array, opts: Object - Nodejs spawn opts)
   * @return Promise
   */
  spawnSync ({ cmd, params, opts }) {
    return spawnAE(cmd, params, appPaths.appDir, opts, true)
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
