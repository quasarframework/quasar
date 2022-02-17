const { removeSync } = require('fs-extra')
const semver = require('semver')

const appPaths = require('../app-paths')
const extensionJson = require('./extension-json')
const getPackageJson = require('../helpers/get-package-json')

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
   * Get the internal persistent config of this extension.
   * Returns empty object if it has none.
   *
   * @return {object} internal persistent config of this extension
   */
  getPersistentConf () {
    return extensionJson.getInternal(this.extId)
  }

  /**
   * Check if an app package is installed. Can also
   * check its version against specific semver condition.
   *
   * Example of semver condition:
   *   '1.x || >=2.5.0 || 5.0.0 - 7.2.3'
   *
   * @param {string} packageName
   * @param {string} (optional) semverCondition
   * @return {boolean} package is installed and meets optional semver condition
   */
  hasPackage (packageName, semverCondition) {
    const json = getPackageJson(packageName)

    if (json === void 0) {
      return false
    }

    return semverCondition !== void 0
      ? semver.satisfies(json.version, semverCondition)
      : true
  }

  /**
   * Check if another app extension is installed.
   *
   * @param {string} extId
   * @return {boolean} has the extension installed.
   */
  hasExtension (extId) {
    return extensionJson.has(extId)
  }

  /**
   * Get the version of an an app's package.
   *
   * @param {string} packageName
   * @return {string|undefined} version of app's package
   */
  getPackageVersion (packageName) {
    const json = getPackageJson(packageName)
    return json !== void 0
      ? json.version
      : void 0
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
