import { relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import fse from 'fs-extra'
import inquirer from 'inquirer'
import { isBinaryFileSync as isBinary } from 'isbinaryfile'

import { IndexAPI } from './api-classes/IndexAPI.js'
import { InstallAPI } from './api-classes/InstallAPI.js'
import { UninstallAPI } from './api-classes/UninstallAPI.js'
import { PromptsAPI } from './api-classes/PromptsAPI.js'

import { fatal, log, warn } from '../utils/logger.js'
import { getPackagePath } from '../utils/get-package-path.js'
import { renderTemplate } from '../utils/template.js'

async function promptOverwrite({ targetPath, options, ctx }) {
  const choices = [
    { name: 'Overwrite', value: 'overwrite' },
    { name: 'Overwrite all', value: 'overwriteAll' },
    { name: 'Skip (might break extension)', value: 'skip' },
    { name: 'Skip all (might break extension)', value: 'skipAll' }
  ]

  return await inquirer.prompt([
    {
      name: 'action',
      type: 'select',
      message: `Overwrite "${relative(ctx.appPaths.appDir, targetPath)}"?`,
      choices:
        options !== void 0
          ? choices.filter(choice => options.includes(choice.value))
          : choices,
      default: 'overwrite'
    }
  ])
}

async function renderFile(
  { sourcePath, targetPath, rawCopy, scope, overwritePrompt },
  ctx
) {
  if (overwritePrompt && fse.existsSync(targetPath)) {
    const answer = await promptOverwrite({
      targetPath,
      options: ['overwrite', 'skip'],
      ctx
    })

    if (answer.action === 'skip') return
  }

  fse.ensureFileSync(targetPath)

  if (rawCopy || isBinary(sourcePath)) {
    fse.copyFileSync(sourcePath, targetPath)
  } else {
    const rawContent = fse.readFileSync(sourcePath, 'utf8')
    fse.writeFileSync(
      targetPath,
      renderTemplate(rawContent, scope, { varName: false }),
      'utf8'
    )
  }
}

async function renderFolders({ source, rawCopy, scope }, ctx) {
  let overwrite
  const { globSync } = await import('tinyglobby')
  const files = globSync(['**/*'], { cwd: source })

  for (const rawPath of files) {
    const targetRelativePath = rawPath
      .split('/')
      .map(name => {
        // dotfiles are ignored when published to npm, therefore in templates
        // we need to use underscore instead (e.g. "_gitignore")
        if (name.at(0) === '_' && name.at(1) !== '_') {
          return `.${name.slice(1)}`
        }
        if (name.at(0) === '_' && name.at(1) === '_') {
          return `${name.slice(1)}`
        }
        return name
      })
      .join('/')

    const targetPath = ctx.appPaths.resolve.app(targetRelativePath)
    const sourcePath = resolve(source, rawPath)

    if (overwrite !== 'overwriteAll' && fse.existsSync(targetPath)) {
      if (overwrite === 'skipAll') {
        continue
      } else {
        const answer = await promptOverwrite({ targetPath, ctx })

        if (answer.action === 'overwriteAll') {
          overwrite = 'overwriteAll'
        } else if (answer.action === 'skipAll') {
          overwrite = 'skipAll'
          continue
        } else if (answer.action === 'skip') {
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

  /** @type {boolean | null} */
  #isInstalled = null
  /** @type {import('jiti').Jiti | null} */
  #jiti = null
  /** @type {string | null} */
  #packageParentUrl = null

  constructor({ extName, ctx, appExtJson }) {
    this.#ctx = ctx
    this.#appExtJson = appExtJson

    if (extName.at(0) === '@') {
      const slashIndex = extName.indexOf('/')
      if (slashIndex === -1) {
        fatal(`Invalid Quasar App Extension name: "${extName}"`)
      }

      this.packageFullName =
        extName.slice(0, slashIndex + 1) +
        'quasar-app-extension-' +
        extName.slice(slashIndex + 1)

      this.packageName = '@' + this.#stripVersion(this.packageFullName.slice(1))
      this.extId = '@' + this.#stripVersion(extName.slice(1))
    } else {
      this.packageFullName = `quasar-app-extension-${extName}`
      this.packageName = this.#stripVersion(this.packageFullName)
      this.extId = this.#stripVersion(extName)
    }
  }

  get isInstalled() {
    if (this.#isInstalled === null) {
      this.#loadPackageInfo()
    }

    return this.#isInstalled
  }

  #loadPackageInfo() {
    const { appDir } = this.#ctx.appPaths

    try {
      const resolvedPath =
        // Try `import('quasar-app-extension-foo/package.json')`. It might not work if using `package.json > exports` and the file is not listed
        getPackagePath(`${this.packageFullName}/package.json`, appDir) ||
        // Try `import('quasar-app-extension-foo')` to see if the root import is available (through `package.json > exports` or `package.json > main`)
        getPackagePath(this.packageFullName, appDir) ||
        // As a last resort, try to resolve the index script. By not doing this as the only/first option, we can give a more precise error message
        // if the package is installed but the index script is missing
        this.#getScriptPath('index')

      if (resolvedPath !== void 0) {
        this.#packageParentUrl = pathToFileURL(resolvedPath).href
        this.#isInstalled = true
        return
      }
    } catch {}

    this.#isInstalled = false
  }

  async install(skipPkgInstall) {
    if (/quasar-app-extension-/.test(this.extId)) {
      this.extId = this.extId.replace('quasar-app-extension-', '')
      log(
        `When using an extension, "quasar-app-extension-" is added automatically. Just run "quasar ext add ${
          this.extId
        }"`
      )
    }

    log(
      `${skipPkgInstall ? 'Invoking' : 'Installing'} "${this.extId}" Quasar App Extension`
    )
    log()

    if (skipPkgInstall !== true) {
      await this.#installPackage()
    } else if (!this.isInstalled) {
      fatal(
        `Tried to invoke App Extension "${this.extId}" but its npm package is not installed`
      )
    }

    const prompts = await this.#getScriptPrompts()

    this.#appExtJson.set(this.extId, prompts)

    // run extension install
    const hooks = await this.#runInstallScript(prompts)

    log(`Quasar App Extension "${this.extId}" successfully installed.`)
    log()

    if (hooks && hooks.exitLog.length !== 0) {
      hooks.exitLog.forEach(msg => {
        console.log(msg)
      })
      console.log()
    }
  }

  async uninstall(skipPkgUninstall) {
    log(
      `${skipPkgUninstall ? 'Uninvoking' : 'Uninstalling'} "${this.extId}" Quasar App Extension`
    )
    log()

    // verify if already installed
    if (skipPkgUninstall) {
      if (!this.isInstalled) {
        fatal(
          `Tried to uninvoke App Extension "${this.extId}" but there's no npm package installed for it.`
        )
      }
    } else if (!this.isInstalled) {
      warn(`Quasar App Extension "${this.packageName}" is not installed...`)
      return
    }

    const prompts = this.getPrompts()
    const hooks = await this.#runUninstallScript(prompts)

    this.#appExtJson.remove(this.extId)

    if (skipPkgUninstall !== true) {
      await this.#uninstallPackage()
    }

    log(`Quasar App Extension "${this.extId}" successfully removed.`)
    log()

    if (hooks && hooks.exitLog.length !== 0) {
      hooks.exitLog.forEach(msg => {
        console.log(msg)
      })
      console.log()
    }
  }

  async run() {
    if (!this.isInstalled) {
      warn(`Quasar App Extension "${this.extId}" is missing...`)
      process.exit(1, 'ext-missing')
    }

    const script = await this.#getScript('index', true)

    const api = new IndexAPI(
      {
        ctx: this.#ctx,
        extId: this.extId,
        prompts: this.getPrompts()
      },
      this.#appExtJson
    )

    log(`Running "${this.extId}" Quasar App Extension...`)
    await script(api)

    return api.__getHooks(this.#appExtJson)
  }

  #stripVersion(packageFullName) {
    const index = packageFullName.indexOf('@')
    return index !== -1 ? packageFullName.slice(0, index) : packageFullName
  }

  getPrompts() {
    return this.#appExtJson.getPrompts(this.extId)
  }

  async #getScriptPrompts() {
    const getPromptsObject = await this.#getScript('prompts')

    if (typeof getPromptsObject !== 'function') return {}

    const api = new PromptsAPI(
      {
        ctx: this.#ctx,
        extId: this.extId
      },
      this.#appExtJson
    )

    const prompts = await inquirer.prompt(await getPromptsObject(api))

    console.log()
    return prompts
  }

  async #installPackage() {
    const nodePackager = await this.#ctx.cacheProxy.getModule('nodePackager')
    nodePackager.installPackage(this.packageFullName, { isDevDependency: true })
  }

  async #uninstallPackage() {
    const nodePackager = await this.#ctx.cacheProxy.getModule('nodePackager')
    nodePackager.uninstallPackage(this.packageFullName)
    this.#isInstalled = false
  }

  #scriptsTargetFolderList = ['dist', 'src']
  #scriptsExtensionList = ['', '.js', '.mjs', '.cjs', '.ts']
  /**
   * Returns the absolute path to the script file.
   *
   * It uses Node import resolution rather than filesystem-based resolution, so `package.json > exports` will affect the result, if exists.
   * It will try to resolve the file with no extension, then with `.js`, `.mjs`, `.cjs`, and `.ts`.
   * For each extension, it will first check the `dist` directory, then the `src` directory.
   * To give some examples to the import resolution:
   * - `quasar-app-extension-foo/dist/index`
   * - `quasar-app-extension-foo/dist/index.js`
   * - `quasar-app-extension-foo/src/index.ts`
   *
   * `.ts` AE scripts are loaded via `jiti` at runtime; other formats use native ESM `import()`.
   */
  #getScriptPath(scriptName) {
    if (!this.isInstalled) return

    for (const ext of this.#scriptsExtensionList) {
      for (const folder of this.#scriptsTargetFolderList) {
        const path = getPackagePath(
          `${this.packageFullName}/${folder}/${scriptName}${ext}`,
          this.#ctx.appPaths.appDir
        )

        if (path !== void 0) return path
      }
    }
  }

  async #getJiti() {
    if (this.#jiti === null) {
      const { createJiti } = await import('jiti')
      this.#jiti = createJiti(this.#packageParentUrl, { tsconfigPaths: true })
    }

    return this.#jiti
  }

  async #getScript(scriptName, fatalError) {
    const scriptPath = this.#getScriptPath(scriptName)
    if (!scriptPath) {
      if (fatalError) {
        fatal(
          `App Extension "${this.extId}" has missing ${scriptName} script...`
        )
      }

      return
    }

    let fn

    try {
      let module
      if (scriptPath.endsWith('.ts')) {
        const jiti = await this.#getJiti()
        module = await jiti.import(scriptPath)
      } else {
        module = await import(pathToFileURL(scriptPath))
      }

      fn = module.default ?? module
    } catch (err) {
      console.error(err)

      if (fatalError) {
        fatal(
          `App Extension "${this.extId}" > ${scriptName} script has thrown the error from above.`
        )
      }
    }

    if (typeof fn !== 'function') {
      if (fatalError) {
        fatal(
          `App Extension "${this.extId}" > ${scriptName} script does not have a default export as a function...`
        )
      }

      return
    }

    return fn
  }

  async #runInstallScript(prompts) {
    const script = await this.#getScript('install')

    if (typeof script !== 'function') return

    log('Running App Extension install script...')

    const api = new InstallAPI(
      {
        ctx: this.#ctx,
        extId: this.extId,
        prompts
      },
      this.#appExtJson
    )

    await script(api)

    const hooks = api.__getHooks(this.#appExtJson)

    if (hooks.renderFolders.length !== 0) {
      for (const entry of hooks.renderFolders) {
        await renderFolders(entry, this.#ctx)
      }
    }

    if (hooks.renderFiles.length !== 0) {
      for (const entry of hooks.renderFiles) {
        await renderFile(entry, this.#ctx)
      }
    }

    if (api.__getNodeModuleNeedsUpdate(this.#appExtJson)) {
      const nodePackager = await this.#ctx.cacheProxy.getModule('nodePackager')
      nodePackager.install()
    }

    return hooks
  }

  async #runUninstallScript(prompts) {
    const script = await this.#getScript('uninstall')

    if (typeof script !== 'function') return

    log('Running App Extension uninstall script...')

    const api = new UninstallAPI(
      {
        ctx: this.#ctx,
        extId: this.extId,
        prompts
      },
      this.#appExtJson
    )

    await script(api)

    return api.__getHooks(this.#appExtJson)
  }
}
