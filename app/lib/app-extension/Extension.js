const
  logger = require('../helpers/logger'),
  log = logger('app:extension'),
  warn = logger('app:extension', 'red'),
  appPaths = require('../app-paths')

async function renderFolders ({ source, rawCopy, scope }) {
  const
    fs = require('fs-extra'),
    path = require('path'),
    fglob = require('fast-glob'),
    isBinary = require('isbinaryfile').isBinaryFileSync,
    inquirer = require('inquirer'),
    compileTemplate = require('lodash.template')

  let overwrite
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

    if (overwrite !== 'overwriteAll' && fs.existsSync(targetPath)) {
      if (overwrite === 'skipAll') {
        continue
      }
      else {
        const answer = await inquirer.prompt([{
          name: 'action',
          type: 'list',
          message: `Overwrite "${path.relative(appPaths.appDir, targetPath)}"?`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Overwrite all', value: 'overwriteAll' },
            { name: 'Skip (might break extension)', value: 'skip' },
            { name: 'Skip all (might break extension)', value: 'skipAll' }
          ],
          default: 'overwrite'
        }])

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

    fs.ensureFileSync(targetPath)

    if (rawCopy || isBinary(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath)
    }
    else {
      const rawContent = fs.readFileSync(sourcePath, 'utf-8')
      const template = compileTemplate(rawContent)
      fs.writeFileSync(targetPath, template(scope), 'utf-8')
    }
  }
}

module.exports = class Extension {
  constructor (name) {
    if (name.charAt(0) === '@') {
      const slashIndex = name.indexOf('/')
      if (slashIndex === -1) {
        warn(`⚠️  Invalid Quasar App Extension name: "${name}"`)
        process.exit(1)
      }

      this.packageFullName = name.substring(0, slashIndex + 1) +
        'quasar-app-extension-' +
        name.substring(slashIndex + 1)

      this.packageName = '@' + this.__stripVersion(this.packageFullName.substring(1))
      this.extId = '@' + this.__stripVersion(name.substring(1))
    }
    else {
      this.packageFullName = 'quasar-app-extension-' + name
      this.packageName = this.__stripVersion('quasar-app-extension-' + name)
      this.extId = this.__stripVersion(name)
    }
  }

  isInstalled () {
    try {
      require.resolve(this.packageName, {
        paths: [ appPaths.appDir ]
      })
    }
    catch (e) {
      return false
    }

    return true
  }

  async install (skipPkgInstall) {
    if (/quasar-app-extension-/.test(this.extId)) {
      this.extId = this.extId.replace('quasar-app-extension-', '')
      log(
        `When using an extension, "quasar-app-extension-" is added automatically. Just run "quasar ext --add ${
          this.extId
        }"`
      )
    }

    log(`${skipPkgInstall ? 'Invoking' : 'Installing'} "${this.extId}" Quasar App Extension`)
    log()

    const isInstalled = this.isInstalled()

    // verify if already installed
    if (skipPkgInstall === true) {
      if (!isInstalled) {
        warn(`⚠️  Tried to invoke App Extension "${this.extId}" but it's npm package is not installed`)
        process.exit(1)
      }
    }
    else {
      if (isInstalled) {
        const inquirer = require('inquirer')
        const answer = await inquirer.prompt([{
          name: 'reinstall',
          type: 'confirm',
          message: `Already installed. Reinstall?`,
          default: false
        }])

        if (!answer.reinstall) {
          return
        }
      }
    }

    // yarn/npm install
    skipPkgInstall !== true && this.__installPackage()

    const prompts = await this.__getPrompts()

    // run extension install
    const hooks = await this.__runInstallScript(prompts)

    const extensionJson = require('./extension-json')
    extensionJson.add(this.extId, prompts)

    log(`Quasar App Extension "${this.extId}" successfully installed.`)
    log()

    if (hooks && hooks.exitLog.length > 0) {
      hooks.exitLog.forEach(msg => {
        console.log(msg)
      })
      console.log()
    }
  }

  async uninstall (skipPkgUninstall) {
    log(`${skipPkgUninstall ? 'Uninvoking' : 'Uninstalling'} "${this.extId}" Quasar App Extension`)
    log()

    const isInstalled = this.isInstalled()

    // verify if already installed
    if (skipPkgUninstall === true) {
      if (!isInstalled) {
        warn(`⚠️  Tried to uninvoke App Extension "${this.extId}" but there's no npm package installed for it.`)
        process.exit(1)
      }
    }
    else {
      if (!isInstalled) {
        warn(`⚠️  Quasar App Extension "${this.packageName}" is not installed...`)
        return
      }
    }

    const extensionJson = require('./extension-json')
    const prompts = extensionJson.get(this.extId)

    const hooks = await this.__runUninstallScript(prompts)

    extensionJson.remove(this.extId)

    // yarn/npm uninstall
    skipPkgUninstall !== true && this.__uninstallPackage()

    log(`Quasar App Extension "${this.extId}" successfully removed.`)
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
      warn(`⚠️  Quasar App Extension "${this.extId}" is missing...`)
      process.exit(1)
    }

    const script = this.__getScript('index', true)
    const IndexAPI = require('./IndexAPI')
    const extensionJson = require('./extension-json')

    const api = new IndexAPI({
      extId: this.extId,
      prompts: extensionJson.get(this.extId),
      ctx
    })

    log(`Running "${this.extId}" Quasar App Extension...`)
    await script(api, ctx)

    return api.__getHooks()
  }

  __stripVersion (packageFullName) {
    const index = packageFullName.indexOf('@')

    return index > -1
      ? packageFullName.substring(0, index)
      : packageFullName
  }

  async __getPrompts () {
    const questions = this.__getScript('prompts')

    if (!questions) {
      return {}
    }

    const inquirer = require('inquirer')
    const prompts = await inquirer.prompt(questions())

    console.log()
    return prompts
  }

  __installPackage () {
    const
      spawn = require('../helpers/spawn'),
      nodePackager = require('../helpers/node-packager'),
      cmdParam = nodePackager === 'npm'
        ? ['install', '--save-dev']
        : ['add', '--dev']

    log(`Retrieving "${this.packageFullName}"...`)
    spawn.sync(
      nodePackager,
      cmdParam.concat(this.packageFullName),
      appPaths.appDir,
      () => warn(`⚠️  Failed to install ${this.packageFullName}`)
    )
  }

  __uninstallPackage () {
    const
      spawn = require('../helpers/spawn'),
      nodePackager = require('../helpers/node-packager'),
      cmdParam = nodePackager === 'npm'
        ? ['uninstall', '--save-dev']
        : ['remove']

    log(`Uninstalling "${this.packageName}"...`)
    spawn.sync(
      nodePackager,
      cmdParam.concat(this.packageName),
      appPaths.appDir,
      () => warn(`⚠️  Failed to uninstall "${this.packageName}"`)
    )
  }

  __getScript (scriptName, fatal) {
    let script

    try {
      script = require.resolve(this.packageName + '/src/' + scriptName, {
        paths: [ appPaths.appDir ]
      })
    }
    catch (e) {
      if (fatal) {
        warn(`⚠️  App Extension "${this.extId}" has missing ${scriptName} script...`)
        process.exit(1)
      }

      return
    }

    return require(script)
  }

  async __runInstallScript (prompts) {
    const script = this.__getScript('install')

    if (!script) {
      return
    }

    log('Running App Extension install script...')

    const InstallAPI = require('./InstallAPI')

    const api = new InstallAPI({
      extId: this.extId,
      prompts
    })

    await script(api)

    const hooks = api.__getHooks()

    if (hooks.renderFolders.length > 0) {
      for (let entry of hooks.renderFolders) {
        await renderFolders(entry)
      }
    }

    if (api.__needsNodeModulesUpdate) {
      const
        spawn = require('../helpers/spawn'),
        nodePackager = require('../helpers/node-packager'),
        cmdParam = nodePackager === 'npm'
          ? ['install']
          : []

      log(`Updating dependencies...`)
      spawn.sync(
        nodePackager,
        cmdParam,
        appPaths.appDir,
        () => warn(`⚠️  Failed to update dependencies`)
      )
    }

    return hooks
  }

  async __runUninstallScript (prompts) {
    const script = this.__getScript('uninstall')

    if (!script) {
      return
    }

    log('Running App Extension uninstall script...')

    const UninstallAPI = require('./UninstallAPI')
    const api = new UninstallAPI({
      extId: this.extId,
      prompts
    })

    await script(api)

    return api.__getHooks()
  }
}
