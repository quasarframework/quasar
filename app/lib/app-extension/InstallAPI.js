const fs = require('fs-extra')
const path = require('path')
const merge = require('webpack-merge')
const semver = require('semver')

const appPaths = require('../app-paths')
const logger = require('../helpers/logger')
const warn = logger('app:extension(install)', 'red')
const getPackageJson = require('../helpers/get-package-json')
const getCallerPath = require('../helpers/get-caller-path')
const extensionJson = require('./extension-json')

/**
 * API for extension's /install.js script
 */
module.exports = class InstallAPI {
  constructor ({ extId, prompts }) {
    this.extId = extId
    this.prompts = prompts
    this.resolve = appPaths.resolve
    this.appDir = appPaths.appDir

    this.__needsNodeModulesUpdate = false
    this.__hooks = {
      renderFolders: [],
      exitLog: []
    }
  }

  /**
   * Get the internal persistent config of this extension.
   * Returns empty object if it has none.
   *
   * @return {object} cfg
   */
  getPersistentConf () {
    return extensionJson.getInternal(this.extId)
  }

  /**
   * Set the internal persistent config of this extension.
   * If it already exists, it is overwritten.
   *
   * @param {object} cfg
   */
  setPersistentConf (cfg) {
    extensionJson.setInternal(this.extId, cfg || {})
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
    this.setPersistentConf(merge(currentCfg, cfg))
  }

  /**
   * Ensure the App Extension is compatible with
   * host app installed package through a
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
   * Check if another app extension is installed
   * (app extension npm package is installed and it was invoked)
   *
   * @param {string} extId
   * @return {boolean} has the extension installed & invoked
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
   * Extend package.json with new props.
   * If specifying existing props, it will override them.
   *
   * @param {object|string} extPkg - Object to extend with or relative path to a JSON file
   */
  extendPackageJson (extPkg) {
    if (!extPkg) {
      return
    }

    if (typeof extPkg === 'string') {
      const dir = getCallerPath()
      const source = path.resolve(dir, extPkg)

      if (!fs.existsSync(source)) {
        warn()
        warn(`⚠️  Extension(${this.extId}): extendPackageJson() - cannot locate ${extPkg}. Skipping...`)
        warn()
        return
      }
      if (fs.lstatSync(source).isDirectory()) {
        warn()
        warn(`⚠️  Extension(${this.extId}): extendPackageJson() - "${extPkg}" is a folder instead of file. Skipping...`)
        warn()
        return
      }

      try {
        extPkg = require(source)
      }
      catch (e) {
        warn(`⚠️  Extension(${this.extId}): extendPackageJson() - "${extPkg}" is malformed`)
        warn()
        process.exit(1)
      }
    }

    if (Object(extPkg) !== extPkg || Object.keys(extPkg).length === 0) {
      return
    }

    const filePath = appPaths.resolve.app('package.json')
    const pkg = merge(require(filePath), extPkg)

    fs.writeFileSync(
      filePath,
      JSON.stringify(pkg, null, 2),
      'utf-8'
    )

    if (
      extPkg.dependencies ||
      extPkg.devDependencies ||
      extPkg.optionalDependencies ||
      extPkg.bundleDependencies ||
      extPkg.peerDependencies
    ) {
      this.__needsNodeModulesUpdate = true
    }
  }

  /**
   * Extend a JSON file with new props (deep merge).
   * If specifying existing props, it will override them.
   *
   * @param {string} file (relative path to app root folder)
   * @param {object} newData (Object to merge in)
   */
  extendJsonFile (file, newData) {
    if (newData !== void 0 && Object(newData) === newData && Object.keys(newData).length > 0) {
      const filePath = appPaths.resolve.app(file)
      const data = merge(fs.existsSync(filePath) ? require(filePath) : {}, newData)

      fs.writeFileSync(
        appPaths.resolve.app(file),
        JSON.stringify(data, null, 2),
        'utf-8'
      )
    }
  }

  /**
   * Render a folder from extension templates into devland.
   * Needs a relative path to the folder of the file calling render().
   *
   * @param {string} templatePath (relative path to folder to render in app)
   * @param {object} scope (optional; rendering scope variables)
   */
  render (templatePath, scope) {
    const dir = getCallerPath()
    const source = path.resolve(dir, templatePath)
    const rawCopy = !scope || Object.keys(scope).length === 0

    if (!fs.existsSync(source)) {
      warn()
      warn(`⚠️  Extension(${this.extId}): render() - cannot locate ${templatePath}. Skipping...`)
      warn()
      return
    }
    if (!fs.lstatSync(source).isDirectory()) {
      warn()
      warn(`⚠️  Extension(${this.extId}): render() - "${templatePath}" is a file instead of folder. Skipping...`)
      warn()
      return
    }

    this.__hooks.renderFolders.push({
      source,
      rawCopy,
      scope
    })
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
