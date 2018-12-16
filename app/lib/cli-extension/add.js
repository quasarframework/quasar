const inquirer = require('inquirer')

const
  logger = require('../helpers/logger'),
  log = logger('app:extension'),
  warn = logger('app:extension', 'red'),
  appPaths = require('../app-paths'),
  { getModule, pkgIsInstalled } = require('./utils/commands')

function pkgInstall (pkgWithVersion) {
  const
    spawn = require('../helpers/spawn'),
    nodePackager = require('../helpers/node-packager'),
    cmdParam = nodePackager === 'npm'
      ? ['install', '--save-dev']
      : ['add', '--dev']

  log(`Retrieving ${pkgWithVersion}...`)
  spawn.sync(
    nodePackager,
    cmdParam.concat(pkgWithVersion),
    appPaths.appDir,
    () => warn(`⚠️  Failed to install ${pkgWithVersion}`)
  )
}

async function runPromptsScript (pkgName) {
  const questions = getModule(pkgName, 'prompts')

  if (!questions) {
    return {}
  }

  const inquirer = require('inquirer')
  return await inquirer.prompt(questions())
}

async function runInstallScript (pkgName, opts) {
  const install = getModule(pkgName, 'install', true)

  await install({
    opts,
    extendPackageJson: () => {},
    resolve: appPaths.resolve,
    render: () => {}
  })
}

module.exports = async (name, nameWithVersion) => {
  // verify if already installed
  if (!pkgIsInstalled(name)) {
    const inquirer = require('inquirer')
    const answer = await inquirer.prompt([{
      name: 'reinstall',
      type: 'confirm',
      message: `Already installed. Reinstall "${name}"?`,
      default: false
    }])

    if (!answer.reinstall) {
      process.exit(0)
    }
  }

  // yarn/npm install
  pkgInstall(nameWithVersion)

  // run prompts, get answers
  const opts = await runPromptsScript (pkgName)

  // run extension install
  await runInstallScript(name, opts)
}
