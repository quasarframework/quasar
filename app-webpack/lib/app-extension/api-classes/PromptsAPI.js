const semver = require('semver')

const { fatal } = require('../../utils/logger.js')
const { getPackageJson } = require('../../utils/get-package-json.js')
const { getBackwardCompatiblePackageName } = require('../utils.app-extension.js')
const { BaseAPI } = require('./BaseAPI.js')

/**
 * API for extension's /prompts.js script
 */
module.exports.PromptsAPI = class PromptsAPI extends BaseAPI {
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
   * @quasar/app-webpack errors out and halts execution
   *
   * Example of semver condition:
   *   '1.x || >=2.5.0 || 5.0.0 - 7.2.3'
   *
   * @param {string} packageName
   * @param {string} semverCondition
   */
  compatibleWith (packageName, semverCondition) {
    const name = getBackwardCompatiblePackageName(packageName)
    const json = getPackageJson(name, this.appDir)

    if (json === void 0) {
      fatal(`Extension(${ this.extId }): Dependency not found - ${ name }. Please install it.`)
    }

    if (!semver.satisfies(json.version, semverCondition)) {
      fatal(`Extension(${ this.extId }): is not compatible with ${ name } v${ json.version }. Required version: ${ semverCondition }`)
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
    const name = getBackwardCompatiblePackageName(packageName)
    const json = getPackageJson(name, this.appDir)

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
    const name = getBackwardCompatiblePackageName(packageName)
    const json = getPackageJson(name, this.appDir)
    return json !== void 0
      ? json.version
      : void 0
  }

  /**
   * Private stuff; to NOT be used in devland
   */

  #appExtJson
}
