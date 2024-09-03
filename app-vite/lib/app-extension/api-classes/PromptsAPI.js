import semver from 'semver'

import { fatal } from '../../utils/logger.js'
import { getPackageJson } from '../../utils/get-package-json.js'
import { BaseAPI } from './BaseAPI.js'

/**
 * API for extension's /prompts.js script
 */
export class PromptsAPI extends BaseAPI {
  constructor (opts, appExtJson) {
    super(opts)
    this.#appExtJson = appExtJson
  }

  /**
   * Ensure the App Extension is compatible with
   * host app installed package through a
   * semver condition.
   *
   * If the semver condition is not met, then
   * @quasar/app-vite errors out and halts execution
   *
   * Example of semver condition:
   *   '1.x || >=2.5.0 || 5.0.0 - 7.2.3'
   *
   * @param {string} packageName
   * @param {string} semverCondition
   */
  compatibleWith (packageName, semverCondition) {
    const json = getPackageJson(packageName, this.appDir)

    if (json === void 0) {
      fatal(`Extension(${ this.extId }): Dependency not found - ${ packageName }. Please install it.`)
    }

    if (!semver.satisfies(json.version, semverCondition)) {
      fatal(`Extension(${ this.extId }): is not compatible with ${ packageName } v${ json.version }. Required version: ${ semverCondition }`)
    }
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
   * Check if another app extension is installed
   * (app extension npm package is installed and it was invoked)
   *
   * @param {string} extId
   * @return {boolean} has the extension installed & invoked
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
   * Private stuff; to NOT be used in devland
   */

  #appExtJson
}
