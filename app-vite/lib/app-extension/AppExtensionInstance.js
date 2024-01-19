import { join, relative, resolve, dirname } from 'node:path'
import { pathToFileURL } from 'node:url'
import fse from 'fs-extra'
import inquirer from 'inquirer'
import { isBinaryFileSync as isBinary } from 'isbinaryfile'
import compileTemplate from 'lodash/template.js'

import { log, warn, fatal } from '../utils/logger.js'

import { IndexAPI } from './api-classes/IndexAPI.js'
import { InstallAPI } from './api-classes/InstallAPI.js'
import { UninstallAPI } from './api-classes/UninstallAPI.js'
import { PromptsAPI } from './api-classes/PromptsAPI.js'
import { getPackagePath } from '../utils/get-package-path.js'

async function promptOverwrite ({ targetPath, options, ctx }) {
  const choices = [
    { name: 'Overwrite', value: 'overwrite' },
    { name: 'Overwrite all', value: 'overwriteAll' },
    { name: 'Skip (might break extension)', value: 'skip' },
    { name: 'Skip all (might break extension)', value: 'skipAll' }
  ]

  return await inquirer.prompt([ {
    name: 'action',
    type: 'list',
    message: `Overwrite "${ relative(ctx.appPaths.appDir, targetPath) }"?`,
    choices: options !== void 0
      ? choices.filter(choice => options.includes(choice.value))
      : choices,
    default: 'overwrite'
  } ])
}

async function renderFile ({ sourcePath, targetPath, rawCopy, scope, overwritePrompt }, ctx) {
  if (overwritePrompt === true && fse.existsSync(targetPath)) {
    const answer = await promptOverwrite({
      targetPath,
      options: [ 'overwrite', 'skip' ],
      ctx
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

async function renderFolders ({ source, rawCopy, scope }, ctx) {
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

    const targetPath = ctx.appPaths.resolve.app(targetRelativePath)
    const sourcePath = resolve(source, rawPath)

    if (overwrite !== 'overwriteAll' && fse.existsSync(targetPath)) {
      if (overwrite === 'skipAll') {
        continue
      }
      else {
        const answer = await promptOverwrite({ targetPath, ctx })

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

    await renderFile({ sourcePath, targetPath, rawCopy, scope }, ctx)
  }
}

export class AppExtensionInstance {
  #ctx
  #appExtJson

  extId
  packageFullName
  packageName

  #isInstalled = null
  #packagePath = null

  constructor ({ extName, ctx, appExtJson }) {
    this.#ctx = ctx
    this.#appExtJson = appExtJson

    if (extName.charAt(0) === '@') {
      const slashIndex = extName.indexOf('/')
      if (slashIndex === -1) {
        fatal(`Invalid Quasar App Extension name: "${ extName }"`)
      }

      this.packageFullName = extName.substring(0, slashIndex + 1)
        + 'quasar-app-extension-'
        + extName.substring(slashIndex + 1)

      this.packageName = '@' + this.#stripVersion(this.packageFullName.substring(1))
      this.extId = '@' + this.#stripVersion(extName.substring(1))
    }
    else {
      this.packageFullName = `quasar-app-extension-${ extName }`
      this.packageName = this.#stripVersion(this.packageFullName)
      this.extId = this.#stripVersion(extName)
    }
  }

  get isInstalled () {
    if (this.#isInstalled !== null) {
      return this.#isInstalled
    }

    this.#loadPackageInfo()
    return this.#isInstalled
  }

  get packagePath () {
    if (this.#packagePath !== null) {
      return this.#packagePath || void 0
    }

    this.#loadPackageInfo()
    return this.#packagePath || void 0
  }

  #loadPackageInfo () {
    try {
      const packagePath = getPackagePath(
        join(this.packageFullName, 'package.json'),
        this.#ctx.appPaths.appDir
      )

      if (packagePath !== void 0) {
        this.#isInstalled = true
        this.#packagePath = dirname(packagePath)
        return
      }
    }
    catch (_) {}

    this.#markAsNotInstalled()
  }

  #markAsNotInstalled () {
    this.#isInstalled = false
    this.#packagePath = false
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

    // verify if already installed
    if (skipPkgInstall === true) {
      if (!this.isInstalled) {
        fatal(`Tried to invoke App Extension "${ this.extId }" but its npm package is not installed`)
      }
    }
    else if (this.isInstalled) {
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

    // yarn/npm/pnpm install
    if (skipPkgInstall !== true) {
      await this.#installPackage()
    }

    const prompts = await this.#getScriptPrompts()

    this.#appExtJson.set(this.extId, prompts)

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

    // verify if already installed
    if (skipPkgUninstall === true) {
      if (!this.isInstalled) {
        fatal(`Tried to uninvoke App Extension "${ this.extId }" but there's no npm package installed for it.`)
      }
    }
    else if (!this.isInstalled) {
      warn(`Quasar App Extension "${ this.packageName }" is not installed...`)
      return
    }

    const prompts = this.getPrompts()
    const hooks = await this.#runUninstallScript(prompts)

    this.#appExtJson.remove(this.extId)

    // yarn/npm/pnpm uninstall
    if (skipPkgUninstall !== true) {
      await this.#uninstallPackage()
    }

    log(`Quasar App Extension "${ this.extId }" successfully removed.`)
    log()

    if (hooks && hooks.exitLog.length > 0) {
      hooks.exitLog.forEach(msg => {
        console.log(msg)
      })
      console.log()
    }
  }

  async run () {
    if (!this.isInstalled) {
      warn(`Quasar App Extension "${ this.extId }" is missing...`)
      process.exit(1, 'ext-missing')
    }

    const script = await this.#getScript('index', true)

    const api = new IndexAPI({
      ctx: this.#ctx,
      extId: this.extId,
      prompts: this.getPrompts()
    }, this.#appExtJson)

    log(`Running "${ this.extId }" Quasar App Extension...`)
    await script(api)

    return api.__getHooks(this.#appExtJson)
  }

  #stripVersion (packageFullName) {
    const index = packageFullName.indexOf('@')

    return index > -1
      ? packageFullName.substring(0, index)
      : packageFullName
  }

  getPrompts () {
    return this.#appExtJson.getPrompts(this.extId)
  }

  async #getScriptPrompts () {
    const getPromptsObject = await this.#getScript('prompts')

    if (typeof getPromptsObject !== 'function') {
      return {}
    }

    const api = new PromptsAPI({
      ctx: this.#ctx,
      extId: this.extId
    }, this.#appExtJson)

    const prompts = await inquirer.prompt(
      await getPromptsObject(api)
    )

    console.log()
    return prompts
  }

  async #installPackage () {
    const nodePackager = await this.#ctx.cacheProxy.getModule('nodePackager')
    nodePackager.installPackage(this.packageFullName, { isDevDependency: true })
  }

  async #uninstallPackage () {
    const nodePackager = await this.#ctx.cacheProxy.getModule('nodePackager')
    nodePackager.uninstallPackage(this.packageFullName)
    this.#markAsNotInstalled()
  }

  /**
   * Returns the file absolute path. If the file cannot be found into the default 'src' folder,
   * searches it into the `dist` folder.
   *
   * This allows to use preprocessors (eg. TypeScript) for all AE files (even index, install and other Quasar-specific scripts)
   * as long as the corresponding file isn't available into the `src` folder, making the feature opt-in
   */
  #getScriptFile (scriptName) {
    const { packagePath } = this

    let scriptFile = join(packagePath, `dist/${ scriptName }.js`)
    if (fse.existsSync(scriptFile)) {
      return scriptFile
    }

    scriptFile = join(packagePath, `src/${ scriptName }.js`)
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

    let fn

    try {
      const { default: defaultFn } = await import(
        pathToFileURL(script)
      )

      fn = defaultFn
    }
    catch (err) {
      console.error(err)

      if (fatalError) {
        fatal(`App Extension "${ this.extId }" > ${ scriptName } script has thrown the error from above.`)
      }
    }

    if (typeof fn !== 'function') {
      if (fatalError) {
        fatal(`App Extension "${ this.extId }" > ${ scriptName } script does not have a default export as a function...`)
      }

      return
    }

    return fn
  }

  async #runInstallScript (prompts) {
    const script = await this.#getScript('install')

    if (typeof script !== 'function') {
      return
    }

    log('Running App Extension install script...')

    const api = new InstallAPI({
      ctx: this.#ctx,
      extId: this.extId,
      prompts
    }, this.#appExtJson)

    await script(api)

    const hooks = api.__getHooks(this.#appExtJson)

    if (hooks.renderFolders.length > 0) {
      for (const entry of hooks.renderFolders) {
        await renderFolders(entry, this.#ctx)
      }
    }

    if (hooks.renderFiles.length > 0) {
      for (const entry of hooks.renderFiles) {
        await renderFile(entry, this.#ctx)
      }
    }

    if (api.__getNodeModuleNeedsUpdate(this.#appExtJson) === true) {
      const nodePackager = await this.#ctx.cacheProxy.getModule('nodePackager')
      nodePackager.install()
    }

    return hooks
  }

  async #runUninstallScript (prompts) {
    const script = await this.#getScript('uninstall')

    if (typeof script !== 'function') {
      return
    }

    log('Running App Extension uninstall script...')

    const api = new UninstallAPI({
      ctx: this.#ctx,
      extId: this.extId,
      prompts
    }, this.#appExtJson)

    await script(api)

    return api.__getHooks(this.#appExtJson)
  }
}
