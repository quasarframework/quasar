const
  logger = require('../helpers/logger'),
  log = logger('app:extension'),
  warn = logger('app:extension', 'red'),
  appPaths = require('../app-paths')

module.exports = class Extension {
  constructor (name) {
    if (name.charAt(0) === '@') {
      const slashIndex = name.indexOf('/')
      if (slashIndex === -1) {
        warn(`⚠️  Invalid app cli extension name: "${name}"`)
        process.exit(1)
      }

      this.packageFullName = name.substring(0, slashIndex + 1) +
        'quasar-cli-extension-' +
        name.substring(slashIndex + 1)

      this.packageName = '@' + this.__stripVersion(this.packageFullName.substring(1))
      this.extId = '@' + this.__stripVersion(name.substring(1))
    }
    else {
      this.packageFullName = 'quasar-cli-extension-' + name
      this.packageName = this.__stripVersion('quasar-cli-extension-' + name)
      this.extId = this.__stripVersion(name)
    }
  }

  get prompts () {
    return (async () => {
      const questions = this.__getScript('prompts')

      if (!questions) {
        return {}
      }

      const inquirer = require('inquirer')
      return await inquirer.prompt(questions())
    })()
  }

  isInstalled () {
    try {
      require(this.packageName)
    }
    catch (e) {
      return false
    }

    return true
  }

  async install () {
    // verify if already installed
    if (this.isInstalled()) {
      const inquirer = require('inquirer')
      const answer = await inquirer.prompt([{
        name: 'reinstall',
        type: 'confirm',
        message: `Already installed. Reinstall "${name}"?`,
        default: false
      }])

      if (!answer.reinstall) {
        return
      }
    }

    // yarn/npm install
    this.__installPackage()

    // run extension install
    const hooks = await this.__runInstallScript()

    const extensionJson = require('./extension-json')
    extensionJson.add(this.extId, this.prompts)

    if (hooks.exitLog.length > 0) {
      hooks.exitLog.forEach(msg => {
        console.log(msg)
      })
    }
  }

  async uninstall () {
    // verify if installed
    if (!this.isInstalled()) {
      warn(`⚠️  Quasar app cli extension "${this.packageName}" is not installed...`)
      return
    }

    const hooks = await this.__runUninstallScript()

    const extensionJson = require('./extension-json')
    extensionJson.remove(this.extId)

    // yarn/npm uninstall
    this.__uninstallPackage()

    if (hooks.exitLog.length > 0) {
      hooks.exitLog.forEach(msg => {
        console.log(msg)
      })
    }
  }

  async run () {
    if (!this.isInstalled()) {
      warn(`⚠️  Quasar app cli extension "${this.extId}" is missing...`)
      return
    }

    const script = this.__getScript('index', true)
    const IndexAPI = require('./utils/IndexAPI')
    const extensionJson = require('./extension-json')

    const api = new IndexAPI({
      opts: extensionJson.get(this.extId)
    })

    await script(api)

    return api.__getHooks()
  }

  __stripVersion (packageFullName) {
    const index = packageFullName.indexOf('@')

    return packageFullName > -1
      ? packageFullName.substring(0, index)
      : packageFullName
  }

  __installPackage () {
    const
      spawn = require('../helpers/spawn'),
      nodePackager = require('../helpers/node-packager'),
      cmdParam = nodePackager === 'npm'
        ? ['install', '--save-dev']
        : ['add', '--dev']

    log(`Retrieving ${this.packageFullName}...`)
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

    log(`Uninstalling ${this.packageName}...`)
    spawn.sync(
      nodePackager,
      cmdParam.concat(this.packageName),
      appPaths.appDir,
      () => warn(`⚠️  Failed to uninstall ${this.packageName}`)
    )
  }

  __getScript (scriptName, fatal) {
    let script

    try {
      script = require(this.packageName + '/' + scriptName)
    }
    catch (e) {
      if (fatal) {
        warn(`⚠️  Extension ${this.extId} has missing ${scriptName} script...`)
        process.exit(1)
      }
    }

    return script
  }

  async __runInstallScript () {
    const script = this.__getScript('install', true)
    const InstallAPI = require('./utils/InstallAPI')

    const api = new InstallAPI({
      prompts: this.prompts
    })

    await script(api)

    if (api.__packageJsonChanged) {
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

    return api.__getHooks()
  }

  async __runUninstallScript () {
    const script = this.__getScript('uninstall')

    if (!script) {
      return
    }

    const UninstallAPI = require('./utils/UninstallAPI')
    const api = new UninstallAPI({
      prompts: this.prompts
    })

    await script(api)

    if (api.__exitFn.length > 0) {
      //
    }
  }
}
