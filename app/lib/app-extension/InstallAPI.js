const
  fs = require('fs-extra'),
  path = require('path'),
  merge = require('webpack-merge'),
  compileTemplate = require('lodash.template')

const
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  warn = logger('app:extension(install)', 'red'),
  quasarAppVersion = require('../../package.json').version,
  getCallerPath = require('../helpers/get-caller-path')

/**
 * API for extension's /install.js script
 */
module.exports = class InstallAPI {
  constructor ({ extId, prompts }) {
    this.extId = extId
    this.quasarAppVersion = quasarAppVersion
    this.prompts = prompts
    this.resolve = appPaths.resolve
    this.appDir = appPaths.appDir

    this.__needsNodeModulesUpdate = false
    this.__hooks = {
      exitLog: []
    }
  }

  /**
   * Ensure the App Extension is compatible with
   * locally installed @quasar/app through a
   * semver condition.
   *
   * If the semver condition is not met, then
   * @quasar/app errors out and halts execution
   *
   * Example of semver condition:
   *   '1.x || >=2.5.0 || 5.0.0 - 7.2.3'
   *
   * @param {string} semverCondition
   */
  compatibleWithQuasarApp (semverCondition) {
    const semver = require('semver')

    if (!semver.satisfies(quasarAppVersion, semverCondition)) {
      warn(`⚠️  Extension(${this.extId}): is not compatible with @quasar/app v${quasarAppVersion}`)
      process.exit(1)
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
   * Extend package.json with new props.
   * If specifying existing props, it will override them.
   *
   * @param {object} extPkg
   */
  extendPackageJson (extPkg) {
    if (extPkg !== void 0 && Object(extPkg) === extPkg && Object.keys(extPkg).length > 0) {
      const
        filePath = appPaths.resolve.app('package.json'),
        pkg = merge(require(filePath), extPkg)

      fs.writeFileSync(
        appPaths.resolve.app('package.json'),
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
      const
        filePath = appPaths.resolve.app(file),
        data = merge(fs.existsSync(filePath) ? require(filePath) : {}, newData)

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
   * @param {string} templatePath
   * @param {boolean} rawCopy (copy file/folder as is, don't interpret prompts)
   * @param {object} additionalOpts (rendering opts)
   */
  render (templatePath, additionalOpts, rawCopy = false) {
    const
      dir = getCallerPath(),
      source = path.resolve(dir, templatePath),
      scope = additionalOpts
        ? Object.assign({}, this.prompts, additionalOpts || {})
        : this.prompts

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

    const
      fglob = require('fast-glob'),
      isBinary = require('isbinaryfile').isBinaryFileSync

    const files = fglob.sync(['**/*'], { cwd: source })

    for (const rawPath of files) {
      const targetRelativePath = rawPath.split('/').map(name => {
        // dotfiles are ignored when published to npm, therefore in templates
        // we need to use underscore instead (e.g. "_gitignore")
        if (name.charAt(0) === '_' && name.charAt(1) !== '_') {
          return `.${name.slice(1)}`
        }
        if (name.charAt(0) === '_' && name.charAt(1) === '_') {
          return `${name.slice(1)}`
        }
        return name
      }).join('/')

      const targetPath = appPaths.resolve.app(targetRelativePath)
      const sourcePath = path.resolve(source, rawPath)

      if (rawCopy || isBinary(sourcePath)) {
        fs.ensureFileSync(targetPath)
        fs.copyFileSync(sourcePath, targetPath)
      }
      else {
        const rawContent = fs.readFileSync(sourcePath, 'utf-8')
        const template = compileTemplate(rawContent)
        fs.writeFileSync(targetPath, template(scope), 'utf-8')
      }
    }
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
