import { relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { closeSync, openSync, readSync } from 'node:fs'
import fse from 'fs-extra'

import { IndexAPI } from './api-classes/IndexAPI.js'
import { InstallAPI } from './api-classes/InstallAPI.js'
import { UninstallAPI } from './api-classes/UninstallAPI.js'
import { PromptsAPI } from './api-classes/PromptsAPI.js'

import { createPromptSession, fatal, log } from '../utils/logger.js'
import { getExtensionLogger } from './logger.js'
import { getPackagePath } from '../utils/get-package-path.js'
import { renderTemplate, templateRenderError } from '../utils/template.js'

const renderTemplateCompileOpts = { varName: false }
const overWriteOptions = [
  { label: 'Overwrite', value: 'overwrite' },
  { label: 'Overwrite all', value: 'overwriteAll' },
  { label: 'Skip (might break extension)', value: 'skip' },
  { label: 'Skip all (might break extension)', value: 'skipAll' }
]

async function promptOverwrite({ targetPath, options, ctx }) {
  const promptSession = await createPromptSession(
    `"${relative(ctx.appPaths.appDir, targetPath)}" already exists`
  )

  const { action } = await promptSession.prompt({
    action: () =>
      promptSession.select({
        message: 'What do you want to do?',
        options:
          options !== void 0
            ? overWriteOptions.filter(choice => options.includes(choice.value))
            : overWriteOptions,
        initialValue: 'overwrite'
      })
  })

  promptSession.end('Thanks for answering!')
  return action
}

async function renderFile(
  { sourcePath, targetPath, rawCopy, scope, overwritePrompt },
  ctx,
  logger
) {
  if (overwritePrompt && fse.existsSync(targetPath)) {
    const action = await promptOverwrite({
      targetPath,
      options: ['overwrite', 'skip'],
      ctx
    })

    if (action === 'skip') return
  }

  if (rawCopy || isBinaryFile(sourcePath)) {
    fse.ensureFileSync(targetPath)
    fse.copyFileSync(sourcePath, targetPath)
  } else {
    const rawContent = fse.readFileSync(sourcePath, 'utf8')
    const content = renderTemplate(rawContent, scope, renderTemplateCompileOpts)

    if (content === templateRenderError) {
      logger.warn(
        `Failed to render template "${sourcePath}". This may break the App Extension...`
      )
    } else {
      fse.ensureFileSync(targetPath)
      fse.writeFileSync(targetPath, content, 'utf8')
    }
  }
}

async function renderFolders({ source, rawCopy, scope }, ctx, logger) {
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
        const action = await promptOverwrite({ targetPath, ctx })

        if (action === 'overwriteAll') {
          overwrite = 'overwriteAll'
        } else if (action === 'skipAll') {
          overwrite = 'skipAll'
          continue
        } else if (action === 'skip') {
          continue
        }
      }
    }

    await renderFile({ sourcePath, targetPath, rawCopy, scope }, ctx, logger)
  }
}

function isBinaryFile(sourcePath) {
  const buffer = Buffer.alloc(512)
  const fd = openSync(sourcePath, 'r')

  try {
    const bytesRead = readSync(fd, buffer, 0, 512, 0)
    // If the file contains a null byte, it's almost certainly binary
    return buffer.subarray(0, bytesRead).includes(0x00)
  } finally {
    closeSync(fd)
  }
}

export class AppExtensionInstance {
  extId
  packageFullName
  packageName

  #ctx
  #appExtJson

  /** @type {boolean | null} */
  #isInstalled = null

  /** @type {import('jiti').Jiti | null} */
  #jiti = null
  /** @type {string | null} */
  #packageParentUrl = null

  get logger() {
    return getExtensionLogger(this.extId)
  }

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
        getPackagePath(`${this.packageName}/package.json`, appDir) ||
        // Try `import('quasar-app-extension-foo')` to see if the root import is available (through `package.json > exports` or `package.json > main`)
        getPackagePath(this.packageName, appDir) ||
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

    this.logger.log(skipPkgInstall ? 'Invoking...' : 'Installing...')

    if (skipPkgInstall !== true) {
      await this.#installPackage()
    } else if (!this.isInstalled) {
      this.logger.fatal(
        `Tried to invoke App Extension but its npm package is not installed`
      )
    }

    const prompts = await this.#getScriptPrompts()
    const previousConfig = this.#appExtJson.get(this.extId)

    this.#appExtJson.set(this.extId, prompts)

    let hooks
    try {
      // run extension install
      hooks = await this.#runInstallScript(prompts)
    } catch (err) {
      if (previousConfig === void 0) {
        this.#appExtJson.remove(this.extId)
      } else {
        this.#appExtJson.set(this.extId, previousConfig)
      }

      throw err
    }

    this.logger.log(`Installed App Extension`)

    if (hooks && hooks.exitLog.length !== 0) {
      hooks.exitLog.forEach(msg => {
        console.log(msg)
      })
      console.log()
    }
  }

  async uninstall(skipPkgUninstall) {
    this.logger.log(skipPkgUninstall ? 'Uninvoking...' : 'Uninstalling...')

    // verify if already installed
    if (skipPkgUninstall) {
      if (!this.isInstalled) {
        this.logger.fatal(
          `Tried to uninvoke App Extension but there's no npm package installed for it.`
        )
      }
    } else if (!this.isInstalled) {
      this.logger.warn(`Quasar App Extension is not installed...`)
      return
    }

    const hooks = await this.#runUninstallScript()

    this.#appExtJson.remove(this.extId)

    if (skipPkgUninstall !== true) {
      await this.#uninstallPackage()
    }

    this.logger.log('Removed App Extension')

    if (hooks && hooks.exitLog.length !== 0) {
      hooks.exitLog.forEach(msg => {
        console.log(msg)
      })
      console.log()
    }
  }

  async run() {
    if (!this.isInstalled) {
      this.logger.warn('Quasar App Extension is missing...')
      process.exit(1)
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

    this.logger.log('Running...')
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

    this.logger.log('Running prompts script...')
    log()

    const api = new PromptsAPI(
      {
        ctx: this.#ctx,
        extId: this.extId
      },
      this.#appExtJson
    )

    const prompts = await getPromptsObject(api)
    log()

    if (prompts === void 0) return {}

    if (
      Object(prompts) !== prompts ||
      (Object.getPrototypeOf(prompts) !== Object.prototype &&
        Object.getPrototypeOf(prompts) !== null)
    ) {
      this.logger.fatal('Prompts script must return an object or undefined.')
    }

    return prompts
  }

  async #installPackage() {
    const nodePackager = await this.#ctx.cacheProxy.getModule('nodePackager')
    await nodePackager.installPackage(this.packageFullName, {
      isDevDependency: true
    })
  }

  async #uninstallPackage() {
    const nodePackager = await this.#ctx.cacheProxy.getModule('nodePackager')
    await nodePackager.uninstallPackage(this.packageFullName)
    this.#isInstalled = false
  }

  #scriptsTargetFolderList = ['dist', 'src']
  #scriptsExtensionList = ['', '.js', '.ts', '.mjs', '.cjs']
  /**
   * Returns the absolute path to the script file.
   *
   * It uses Node import resolution rather than filesystem-based resolution, so `package.json > exports` will affect the result, if exists.
   * It will try to resolve the file with no extension, then with the ones defined above.
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
          `${this.packageName}/${folder}/${scriptName}${ext}`,
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
        this.logger.fatal(`App Extension has missing ${scriptName} script...`)
      }

      return
    }

    let fn

    try {
      const module = scriptPath.endsWith('.ts')
        ? await this.#getJiti().then(jiti => jiti.import(scriptPath))
        : await import(pathToFileURL(scriptPath))

      fn = module.default ?? module
    } catch (err) {
      console.error(err)

      this.logger.fatal(`${scriptName} script has thrown the error from above.`)
    }

    if (typeof fn !== 'function') {
      this.logger.fatal(
        `${scriptName} script does not have a default export as a function...`
      )
    }

    return fn
  }

  async #runInstallScript(prompts) {
    const script = await this.#getScript('install')

    if (typeof script !== 'function') return

    this.logger.log('Running install script...')

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
        await renderFolders(entry, this.#ctx, this.logger)
      }
    }

    if (hooks.renderFiles.length !== 0) {
      for (const entry of hooks.renderFiles) {
        await renderFile(entry, this.#ctx, this.logger)
      }
    }

    if (api.__getNodeModuleNeedsUpdate(this.#appExtJson)) {
      const nodePackager = await this.#ctx.cacheProxy.getModule('nodePackager')
      await nodePackager.install()
    }

    return hooks
  }

  async #runUninstallScript() {
    const script = await this.#getScript('uninstall')

    if (typeof script !== 'function') return

    this.logger.log('Running uninstall script...')

    const api = new UninstallAPI(
      {
        ctx: this.#ctx,
        extId: this.extId,
        prompts: this.getPrompts()
      },
      this.#appExtJson
    )

    await script(api)

    return api.__getHooks(this.#appExtJson)
  }
}
