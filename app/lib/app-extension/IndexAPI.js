const
  path = require('path'),
  semver = require('semver')

const
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  warn = logger('app:extension(index)', 'red'),
  getPackageJson = require('../helpers/get-package-json'),
  getCallerPath = require('../helpers/get-caller-path')

/**
 * API for extension's /index.js script
 */
module.exports = class IndexAPI {
  constructor ({ extId, prompts, ctx }) {
    this.ctx = ctx
    this.extId = extId
    this.prompts = prompts
    this.resolve = appPaths.resolve
    this.appDir = appPaths.appDir

    this.__hooks = {
      extendQuasarConf: [],
      extendWebpack: [],
      chainWebpackMainElectronProcess: [],
      extendWebpackMainElectronProcess: [],
      chainWebpack: [],
      beforeDev: [],
      beforeBuild: [],
      afterBuild: [],
      commands: {},
      describeApi: {}
    }
  }

  /**
   * Ensure the App Extension is compatible with
   * host app package through a
   * semver condition.
   *
   * If the semver condition is not met, then
   * @quasar/app errors out and halts execution
   *
   * Example of semver condition:
   *   '1.x || >=2.5.0 || 5.0.0 - 7.2.3'
   *
   * @param {string} packageName
   * @param {string} semverCondition
   */
  compatibleWith (packageName, semverCondition) {
    const json = getPackageJson(packageName)

    if (json === void 0) {
      warn(`⚠️  Extension(${this.extId}): Dependency not found - ${packageName}. Please install it.`)
      process.exit(1)
    }

    if (!semver.satisfies(json.version, semverCondition)) {
      warn(`⚠️  Extension(${this.extId}): is not compatible with ${packageName} v${json.version}. Required version: ${semverCondition}`)
      process.exit(1)
    }
  }

  /**
   * DEPRECATED
   * Alias to compatibleWith('@quasar/app', semverCondition)
   * TODO: remove in rc.1
   *
   * @param {string} semverCondition
   */
  compatibleWithQuasarApp (semverCondition) {
    warn(`⚠️  Extension(${this.extId}): using deprecated compatibleWithQuasarApp() instead of compatibleWith()`)
    this.compatibleWith('@quasar/app', semverCondition)
  }

  /**
   * Check if a host app package is installed. Can also
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
   * Check if another app extension is installed
   * (app extension npm package is installed and it was invoked)
   *
   * @param {string} extId
   * @return {boolean} has the extension installed & invoked
   */
  hasExtension (extId) {
    const extensionJson = require('./extension-json')
    return extensionJson.has(extId)
  }

  /**
   * Get the version of a host app package.
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
   * Extend quasar.conf
   *
   * @param {function} fn
   *   (cfg: Object, ctx: Object) => undefined
   */
  extendQuasarConf (fn) {
    this.__hooks.extendQuasarConf.push({ extId: this.extId, fn })
  }

  /**
   * Chain webpack config
   *
   * @param {function} fn
   *   (cfg: ChainObject, invoke: Object {isClient, isServer}) => undefined
   */
  chainWebpack (fn) {
    this.__hooks.chainWebpack.push({ extId: this.extId, fn })
  }

  /**
   * Extend webpack config
   *
   * @param {function} fn
   *   (cfg: Object, invoke: Object {isClient, isServer}) => undefined
   */
  extendWebpack (fn) {
    this.__hooks.extendWebpack.push({ extId: this.extId, fn })
  }

  /**
   * Chain webpack config of main electron process
   *
   * @param {function} fn
   *   (cfg: ChainObject) => undefined
   */
  chainWebpackMainElectronProcess (fn) {
    this.__hooks.chainWebpackMainElectronProcess.push({ extId: this.extId, fn })
  }

  /**
   * Extend webpack config of main electron process
   *
   * @param {function} fn
   *   (cfg: Object) => undefined
   */
  extendWebpackMainElectronProcess (fn) {
    this.__hooks.extendWebpackMainElectronProcess.push({ extId: this.extId, fn })
  }

  /**
   * Register a command that will become available as
   * `quasar run <ext-id> <cmd> [args]`.
   *
   * @param {string} commandName
   * @param {function} fn
   *   (args: { [ string ] }, params: {object} }) => ?Promise
   */
  registerCommand (commandName, fn) {
    this.__hooks.commands[commandName] = fn
  }

  /**
   * Register an API file for "quasar describe" command
   *
   * @param {string} name
   * @param {string} relativePath
   *   (relative path to Api file)
   */
  registerDescribeApi (name, relativePath) {
    const dir = getCallerPath()
    this.__hooks.describeApi[name] = path.resolve(dir, relativePath)
  }

  /**
   * Prepare external services before dev command runs.
   *
   * @param {function} fn
   *   () => ?Promise
   */
  beforeDev (fn) {
    this.__hooks.beforeDev.push({ extId: this.extId, fn })
  }

  /**
   * Alias to beforeDev
   * TODO: remove in rc.1
   *
   * @param {function} fn
   *   () => ?Promise
   */
  beforeDevStart (fn) {
    warn(`⚠️  Extension(${this.extId}): using deprecated beforeDevStart() instead of beforeDev()`)
    this.beforeDev(fn)
  }

  /**
   * Run hook before Quasar builds app for production ($ quasar build).
   * At this point, the distributables folder hasn't been created yet.
   *
   * @param {function} fn
   *   () => ?Promise
   */
  beforeBuild (fn) {
    this.__hooks.beforeBuild.push({ extId: this.extId, fn })
  }

  /**
   * Run hook after Quasar built app for production ($ quasar build).
   * At this point, the distributables folder has been created and is available
   * should you wish to do something with it.
   *
   * @param {function} fn
   *   () => ?Promise
   */
  afterBuild (fn) {
    this.__hooks.afterBuild.push({ extId: this.extId, fn })
  }

  /**
   * Private methods
   */

  __getHooks () {
    return this.__hooks
  }
}
