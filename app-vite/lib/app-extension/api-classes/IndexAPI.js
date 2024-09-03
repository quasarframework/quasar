import semver from 'semver'
import { merge } from 'webpack-merge'

import { fatal } from '../../utils/logger.js'
import { getPackageJson } from '../../utils/get-package-json.js'
import { getCallerPath } from '../../utils/get-caller-path.js'
import { BaseAPI } from './BaseAPI.js'

/**
 * API for extension's /index.js script
 */
export class IndexAPI extends BaseAPI {
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
   * @return {object} cfg
   */
  getPersistentConf () {
    return this.#appExtJson.getInternal(this.extId)
  }

  /**
   * Set the internal persistent config of this extension.
   * If it already exists, it is overwritten.
   *
   * @param {object} cfg
   */
  setPersistentConf (cfg) {
    this.#appExtJson.setInternal(this.extId, cfg || {})
  }

  /**
   * Deep merge into the internal persistent config of this extension.
   * If extension does not have any config already set, this is
   * essentially equivalent to setting it for the first time.
   *
   * @param {object} cfg
   */
  mergePersistentConf (cfg = {}) {
    const currentCfg = this.getPersistentConf()
    this.setPersistentConf(merge({}, currentCfg, cfg))
  }

  /**
   * Ensure the App Extension is compatible with
   * host app package through a
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
   * Check if a host app package is installed. Can also
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
   * Get the version of a host app package.
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
   * Extend quasar.config file
   *
   * @param {function} fn
   *   (cfg: Object, ctx: Object) => undefined
   */
  extendQuasarConf (fn) {
    this.#addHook('extendQuasarConf', fn)
  }

  /**
   * Extend Vite config
   *
   * @param {function} fn
   *   (cfg: Object, invoke: Object {isClient, isServer}, api) => undefined
   */
  extendViteConf (fn) {
    this.#addHook('extendViteConf', fn)
  }

  /**
   * Extend Bex scripts (background/content/dom) Esbuild config
   *
   * @param {function} fn
   *   (cfg: Object, api) => undefined
   */
  extendBexScriptsConf (fn) {
    this.#addHook('extendBexScriptsConf', fn)
  }

  /**
   * Extend Electron Main thread Esbuild config
   *
   * @param {function} fn
   *   (cfg: Object, api) => undefined
   */
  extendElectronMainConf (fn) {
    this.#addHook('extendElectronMainConf', fn)
  }

  /**
   * Extend Electron Preload thread Esbuild config
   *
   * @param {function} fn
   *   (cfg: Object, api) => undefined
   */
  extendElectronPreloadConf (fn) {
    this.#addHook('extendElectronPreloadConf', fn)
  }

  /**
   * Extend PWA custom service worker Esbuild config
   * (when using Workbox InjectManifest mode)
   *
   * @param {function} fn
   *   (cfg: Object, api) => undefined
   */
  extendPWACustomSWConf (fn) {
    this.#addHook('extendPWACustomSWConf', fn)
  }

  /**
   * Extend SSR Webserver Esbuild config
   *
   * @param {function} fn
   *   (cfg: Object, api) => undefined
   */
  extendSSRWebserverConf (fn) {
    this.#addHook('extendSSRWebserverConf', fn)
  }

  /**
   * Register a command that will become available as
   * `quasar run <ext-id> <cmd> [args]` and `quasar <ext-id> <cmd> [args]`
   *
   * @param {string} commandName
   * @param {function} fn
   *   ({ args: [ string, ... ], params: {object} }) => ?Promise
   */
  registerCommand (commandName, fn) {
    this.#hooks.commands[ commandName ] = fn
  }

  /**
   * Register an API file for "quasar describe" command
   *
   * @param {string} name
   * @param {string} relativePath (or node_modules reference if it starts with "~")
   *   (relative path to Api file)
   */
  registerDescribeApi (name, relativePath) {
    const callerPath = getCallerPath()

    this.#hooks.describeApi[ name ] = {
      callerPath,
      relativePath
    }
  }

  /**
   * Prepare external services before dev command runs.
   *
   * @param {function} fn
   *   (api, { quasarConf }) => ?Promise
   */
  beforeDev (fn) {
    this.#addHook('beforeDev', fn)
  }

  /**
   * Run hook after Quasar dev server is started ($ quasar dev).
   * At this point, the dev server has been started and is available
   * should you wish to do something with it.
   *
   * @param {function} fn
   *   (api, { quasarConf }) => ?Promise
   */
  afterDev (fn) {
    this.#addHook('afterDev', fn)
  }

  /**
   * Run hook before Quasar builds app for production ($ quasar build).
   * At this point, the distributables folder hasn't been created yet.
   *
   * @param {function} fn
   *   (api, { quasarConf }) => ?Promise
   */
  beforeBuild (fn) {
    this.#addHook('beforeBuild', fn)
  }

  /**
   * Run hook after Quasar built app for production ($ quasar build).
   * At this point, the distributables folder has been created and is available
   * should you wish to do something with it.
   *
   * @param {function} fn
   *   (api, { quasarConf }) => ?Promise
   */
  afterBuild (fn) {
    this.#addHook('afterBuild', fn)
  }

  /**
   * Run hook if publishing was requested ("$ quasar build -P"),
   * after Quasar built app for production and the afterBuild
   * hook (if specified) was executed.
   *
   * @param {function} fn
   *   ({ arg, ...}) => ?Promise
   *      * arg - argument supplied to "--publish"/"-P" parameter
   *      * quasarConf - quasar.config file config object
   *      * distDir - folder where distributables were built
   */
  onPublish (fn) {
    this.#addHook('onPublish', fn)
  }

  /**
   * Private stuff; to NOT be used in devland
   */

  #appExtJson

  #hooks = {
    extendQuasarConf: [],

    extendViteConf: [],
    extendSSRWebserverConf: [],
    extendElectronMainConf: [],
    extendElectronPreloadConf: [],
    extendPWACustomSWConf: [],
    extendBexScriptsConf: [],

    beforeDev: [],
    afterDev: [],
    beforeBuild: [],
    afterBuild: [],
    onPublish: [],
    commands: {},
    describeApi: {}
  }

  __getHooks (appExtJson) {
    // protect against external access
    if (appExtJson === this.#appExtJson) {
      return this.#hooks
    }
  }

  #addHook (name, fn) {
    this.#hooks[ name ].push({ fn, api: this })
  }
}
