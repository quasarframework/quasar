const
  fs = require('fs'),
  appPaths = require('../app-paths')

module.exports = class InstallAPI {
  constructor ({ prompts }) {
    this.prompts = prompts

    this.__hooks = {
      exitLog: []
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
   * Extend package.json with new props.
   * If specifying existing props, it will override them.
   *
   * @param {object} extPkg
   */
  extendPackageJson (extPkg) {
    if (extPkg !== void 0 && Object(extPkg) === extPkg && Object.keys(extPkg).length > 0) {
      const
        filePath = appPaths.resolve.app('package.json')
        pkg = require(filePath)

      Object.assign(pkg, extPkg)
      fs.writeFileSync(appPath.resolve.app('new.package.json'), JSON.stringify(pkg, null, 2), 'utf-8')
      this.__packageJsonChanged = true
    }
  }

  /**
   * Render a folder/file from extension templates.
   * Needs a relative path to extension's install script.
   *
   * @param {string} templatePath
   */
  render (templatePath) {
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
