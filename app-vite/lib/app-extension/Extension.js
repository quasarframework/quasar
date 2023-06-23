
import path from 'node:path'
import fse from 'fs-extra'
import { createRequire } from 'node:module'
import inquirer from 'inquirer'
import { isBinaryFileSync as isBinary } from 'isbinaryfile'
import compileTemplate from 'lodash/template.js'

import appPaths from '../app-paths.js'
import { log, warn, fatal } from '../utils/logger.js'
import { extensionJson } from './extension-json.js'
import { nodePackager } from '../utils/node-packager.js'

import { IndexAPI } from './IndexAPI.js'
import { InstallAPI } from './InstallAPI.js'
import { UninstallAPI } from './UninstallAPI.js'
import { getPackagePath } from '../utils/get-package-path.js'

const require = createRequire(import.meta.url)

async function promptOverwrite ({ targetPath, options }) {
  const choices = [
    { name: 'Overwrite', value: 'overwrite' },
    { name: 'Overwrite all', value: 'overwriteAll' },
    { name: 'Skip (might break extension)', value: 'skip' },
    { name: 'Skip all (might break extension)', value: 'skipAll' }
  ]

  return await inquirer.prompt([ {
    name: 'action',
    type: 'list',
    message: `Overwrite "${ path.relative(appPaths.appDir, targetPath) }"?`,
    choices: options !== void 0
      ? choices.filter(choice => options.includes(choice.value))
      : choices,
    default: 'overwrite'
  } ])
}

async function renderFile ({ sourcePath, targetPath, rawCopy, scope, overwritePrompt }) {
  if (overwritePrompt === true && fse.existsSync(targetPath)) {
    const answer = await promptOverwrite({
      targetPath,
      options: [ 'overwrite', 'skip' ]
    })

    if (answer.action === 'skip') {
      return
    }
  }

  fse.ensureFileSync(targetPath)

  if (rawCopy || isBinary(sourcePath)) {
    fse.copyFileSync(sourcePath, targetPath)
  }
  else {
    const rawContent = fse.readFileSync(sourcePath, 'utf-8')
    const template = compileTemplate(rawContent, { interpolate: /<%=([\s\S]+?)%>/g })
    fse.writeFileSync(targetPath, template(scope), 'utf-8')
  }
}

async function renderFolders ({ source, rawCopy, scope }) {
  let overwrite
  const { default: fglob } = await import('fast-glob')
  const files = fglob.sync([ '**/*' ], { cwd: source })

  for (const rawPath of files) {
    const targetRelativePath = rawPath.split('/').map(name => {
      // dotfiles are ignored when published to npm, therefore in templates
      // we need to use underscore instead (e.g. "_gitignore")
      if (name.charAt(0) === '_' && name.charAt(1) !== '_') {
        return `.${ name.slice(1) }`
      }
      if (name.charAt(0) === '_' && name.charAt(1) === '_') {
        return `${ name.slice(1) }`
      }
      return name
    }).join('/')

    const targetPath = appPaths.resolve.app(targetRelativePath)
    const sourcePath = path.resolve(source, rawPath)

    if (overwrite !== 'overwriteAll' && fse.existsSync(targetPath)) {
      if (overwrite === 'skipAll') {
        continue
      }
      else {
        const answer = await promptOverwrite({ targetPath })

        if (answer.action === 'overwriteAll') {
          overwrite = 'overwriteAll'
        }
        else if (answer.action === 'skipAll') {
          overwrite = 'skipAll'
          continue
        }
        else if (answer.action === 'skip') {
          continue
        }
      }
    }

    await renderFile({ sourcePath, targetPath, rawCopy, scope })
  }
}

export class Extension {
  constructor (name) {
    if (name.charAt(0) === '@') {
      const slashIndex = name.indexOf('/')
      if (slashIndex === -1) {
        fatal(`Invalid Quasar App Extension name: "${ name }"`)
      }

      this.packageFullName = name.substring(0, slashIndex + 1)
        + 'quasar-app-extension-'
        + name.substring(slashIndex + 1)

      this.packageName = '@' + this.#stripVersion(this.packageFullName.substring(1))
      this.extId = '@' + this.#stripVersion(name.substring(1))
    }
    else {
      this.packageFullName = 'quasar-app-extension-' + name
      this.packageName = this.#stripVersion('quasar-app-extension-' + name)
      this.extId = this.#stripVersion(name)
    }
  }

  isInstalled () {
    try {
      const packagePath = getPackagePath(path.join(this.packageFullName, 'package.json'))
      if (packagePath === void 0) {
        return false
      }

      const packageJsonPath = packagePath
      const pkg = JSON.parse(
        fse.readFileSync(packageJsonPath, 'utf-8')
      )

      this.packageFormat = pkg.type === 'module' ? 'esm' : 'cjs'
      this.packagePath = path.dirname(packagePath)

      return true
    }
    catch (_) {
      return false
    }
  }

  async install (skipPkgInstall) {
    if (/quasar-app-extension-/.test(this.extId)) {
      this.extId = this.extId.replace('quasar-app-extension-', '')
      log(
        `When using an extension, "quasar-app-extension-" is added automatically. Just run "quasar ext add ${
          this.extId
        }"`
      )
    }

    log(`${ skipPkgInstall ? 'Invoking' : 'Installing' } "${ this.extId }" Quasar App Extension`)
    log()

    const isInstalled = this.isInstalled()

    // verify if already installed
    if (skipPkgInstall === true) {
      if (!isInstalled) {
        fatal(`Tried to invoke App Extension "${ this.extId }" but its npm package is not installed`)
      }
    }
    else if (isInstalled) {
      const answer = await inquirer.prompt([ {
        name: 'reinstall',
        type: 'confirm',
        message: 'Already installed. Reinstall?',
        default: false
      } ])

      if (!answer.reinstall) {
        return
      }
    }

    // yarn/npm install
    skipPkgInstall !== true && this.#installPackage()

    const prompts = await this.#getPrompts()

    extensionJson.set(this.extId, prompts)

    // run extension install
    const hooks = await this.#runInstallScript(prompts)

    log(`Quasar App Extension "${ this.extId }" successfully installed.`)
    log()

    if (hooks && hooks.exitLog.length > 0) {
      hooks.exitLog.forEach(msg => {
        console.log(msg)
      })
      console.log()
    }
  }

  async uninstall (skipPkgUninstall) {
    log(`${ skipPkgUninstall ? 'Uninvoking' : 'Uninstalling' } "${ this.extId }" Quasar App Extension`)
    log()

    const isInstalled = this.isInstalled()

    // verify if already installed
    if (skipPkgUninstall === true) {
      if (!isInstalled) {
        fatal(`Tried to uninvoke App Extension "${ this.extId }" but there's no npm package installed for it.`)
      }
    }
    else if (!isInstalled) {
      warn(`Quasar App Extension "${ this.packageName }" is not installed...`)
      return
    }

    const prompts = extensionJson.getPrompts(this.extId)
    const hooks = await this.#runUninstallScript(prompts)

    extensionJson.remove(this.extId)

    // yarn/npm uninstall
    skipPkgUninstall !== true && this.#uninstallPackage()

    log(`Quasar App Extension "${ this.extId }" successfully removed.`)
    log()

    if (hooks && hooks.exitLog.length > 0) {
      hooks.exitLog.forEach(msg => {
        console.log(msg)
      })
      console.log()
    }
  }

  async run (ctx) {
    if (!this.isInstalled()) {
      warn(`Quasar App Extension "${ this.extId }" is missing...`)
      process.exit(1, 'ext-missing')
    }

    const script = await this.#getScript('index', true)

    const api = new IndexAPI({
      extId: this.extId,
      prompts: extensionJson.getPrompts(this.extId),
      ctx
    })

    log(`Running "${ this.extId }" Quasar App Extension...`)
    await script(api)

    return api.__getHooks()
  }

  #stripVersion (packageFullName) {
    const index = packageFullName.indexOf('@')

    return index > -1
      ? packageFullName.substring(0, index)
      : packageFullName
  }

  async #getPrompts () {
    const questions = await this.#getScript('prompts')

    if (!questions) {
      return {}
    }

    const prompts = await inquirer.prompt(questions())

    console.log()
    return prompts
  }

  #installPackage () {
    nodePackager.installPackage(this.packageFullName, { isDev: true })
  }

  #uninstallPackage () {
    nodePackager.uninstallPackage(this.packageFullName)
  }

  /**
   * Returns the file absolute path. If the file cannot be found into the default 'src' folder,
   * searches it into the `dist` folder.
   *
   * This allows to use preprocessors (eg. TypeScript) for all AE files (even index, install and other Quasar-specific scripts)
   * as long as the corresponding file isn't available into the `src` folder, making the feature opt-in
   */
  #getScriptFile (scriptName) {
    let scriptFile = path.join(this.packagePath, `src/${ scriptName }.js`)
    if (fse.existsSync(scriptFile)) {
      return scriptFile
    }

    scriptFile = path.join(this.packagePath, `dist/${ scriptName }.js`)
    if (fse.existsSync(scriptFile)) {
      return scriptFile
    }

    scriptFile = path.join(this.packagePath, `src/${ scriptName }.ts`)
    if (fse.existsSync(scriptFile)) {
      return scriptFile
    }

    scriptFile = path.join(this.packagePath, `dist/${ scriptName }.ts`)
    if (fse.existsSync(scriptFile)) {
      return scriptFile
    }
  }

  async #getScript (scriptName, fatalError) {
    const script = this.#getScriptFile(scriptName)

    if (!script) {
      if (fatalError) {
        fatal(`App Extension "${ this.extId }" has missing ${ scriptName } script...`)
      }

      return
    }

    if (this.packageFormat === 'esm') {
      const { default: fn } = await import(script)
      return fn
    }

    return require(script)
  }

  async #runInstallScript (prompts) {
    const script = await this.#getScript('install')

    if (!script) {
      return
    }

    log('Running App Extension install script...')

    const api = new InstallAPI({
      extId: this.extId,
      prompts
    })

    await script(api)

    const hooks = api.__getHooks()

    if (hooks.renderFolders.length > 0) {
      for (const entry of hooks.renderFolders) {
        await renderFolders(entry)
      }
    }

    if (hooks.renderFiles.length > 0) {
      for (const entry of hooks.renderFiles) {
        await renderFile(entry)
      }
    }

    if (api.__needsNodeModulesUpdate) {
      nodePackager.install()
    }

    return hooks
  }

  async #runUninstallScript (prompts) {
    const script = await this.#getScript('uninstall')

    if (!script) {
      return
    }

    log('Running App Extension uninstall script...')

    const api = new UninstallAPI({
      extId: this.extId,
      prompts
    })

    await script(api)

    return api.__getHooks()
  }
}
