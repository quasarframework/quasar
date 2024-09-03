import fse from 'fs-extra'
import semver from 'semver'

import { getPackageJson } from '../../utils/get-package-json.js'
import { BaseAPI } from './BaseAPI.js'

/**
 * API for extension's /uninstall.js script
 */
export class UninstallAPI extends BaseAPI {
  prompts

  constructor (opts, appExtJson) {
    super(opts)

    this.prompts = opts.prompts
    this.#appExtJson = appExtJson
  }

  /**
   * Get the internal persistent config of this extension.
   * Returns empty object if it has none.
   *
   * @return {object} internal persistent config of this extension
   */
  getPersistentConf () {
    return this.#appExtJson.getInternal(this.extId)
  }

  /**
   * Check if an app package is installed. Can also
   * check its version against specific semver condition.
   *
   * Example of semver condition:
   *   '1.x || >=2.5.0 || 5.0.0 - 7.2.3'
   *
   * @param {string} packageName
   * @param {string} semverCondition
   * @return {boolean} package is installed and meets optional semver condition
   */
  hasPackage (packageName, semverCondition) {
    const json = getPackageJson(packageName, this.appDir)

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
    return this.#appExtJson.has(extId)
  }

  /**
   * Get the version of an an app's package.
   *
   * @param {string} packageName
   * @return {string|undefined} version of app's package
   */
  getPackageVersion (packageName) {
    const json = getPackageJson(packageName, this.appDir)
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
    fse.removeSync(this.resolve.app(__path))
  }

  /**
   * Add a message to be printed after App CLI finishes up install.
   *
   * @param {string} msg
   */
  onExitLog (msg) {
    this.#hooks.exitLog.push(msg)
  }

  /**
   * Private stuff; to NOT be used in devland
   */

  #appExtJson

  #hooks = {
    exitLog: []
  }

  __getHooks (appExtJson) {
    // protect against external access
    if (appExtJson === this.#appExtJson) {
      return this.#hooks
    }
  }
}
