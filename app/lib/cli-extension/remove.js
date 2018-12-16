const
  logger = require('../helpers/logger'),
  log = logger('app:extension'),
  warn = logger('app:extension', 'red'),
  appPaths = require('../app-paths'),
  { getModule, pkgIsInstalled } = require('./utils/commands')

function pkgUninstall (name) {
  const
    spawn = require('../helpers/spawn'),
    nodePackager = require('../helpers/node-packager'),
    cmdParam = nodePackager === 'npm'
      ? ['uninstall']
      : ['remove']

  log(`Uninstalling ${name}...`)
  spawn.sync(
    nodePackager,
    cmdParam.concat(name),
    appPaths.appDir,
    () => warn(`⚠️  Failed to uninstall ${name}`)
  )
}

async function runUninstallScript (name) {
  const uninstall = getModule(pkgName, 'uninstall')

  if (!uninstall) {
    return
  }

  await uninstall({
    opts: {},
    resolve: () => {},
    removeLocation: () => {}
  })
}

module.exports = async (name, nameWithVersion) => {
  // verify if installed
  if (!pkgIsInstalled(name)) {
    warn(`⚠️  Quasar app cli extension "${name}" is not installed...`)
    process.exit(1)
  }

  await runUninstallScript(name)

  // yarn/npm uninstall
  pkgUninstall (name)
}
