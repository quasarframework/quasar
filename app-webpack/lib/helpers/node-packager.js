const fs = require('fs')

const appPaths = require('../app-paths')
const spawn = require('cross-spawn').sync
const { log, warn, fatal } = require('./logger')
const { spawnSync } = require('./spawn')

class PackageManager {
  name = 'unknown'
  lockFile = 'unknown'

  isUsed() {
    return fs.existsSync(appPaths.resolve.app(this.lockFile))
  }

  isInstalled() {
    try {
      // spawnSync helper logs stuff and exits the app on error, so we don't use it here
      return spawn(this.name, ['--version']).status === 0
    }
    catch (err) {
      return false
    }
  }

  install({ cwd, displayName } = {}) {
    displayName = displayName ? displayName + ' ' : ''

    log(`Installing ${displayName}dependencies...`)
    this.__run(['install'], {
      cwd,
      onFail: () => fatal(`Failed to install ${displayName}dependencies`, 'FAIL')
    })
  }

  getInstallPackageParams(names, isDev) {
    return []
  }

  installPackage (name, { cwd, displayName = name, isDev = false } = {}) {
    const params = this.getInstallPackageParams(Array.isArray(name) ? name : [name], isDev)

    log(`Installing ${displayName}...`)
    this.__run(params, {
      cwd,
      onFail: () => fatal(`Failed to install ${displayName}`, 'FAIL')
    })
  }

  getUninstallPackageParams(names) {
    return []
  }

  uninstallPackage (name, { cwd, displayName = name } = {}) {
    const params = this.getUninstallPackageParams(Array.isArray(name) ? name : [name])

    log(`Uninstalling ${displayName}...`)
    this.__run(params, {
      cwd,
      onFail: () => fatal(`Failed to uninstall ${displayName}`, 'FAIL')
    })
  }

  __run (params, { cwd, onFail } = {}) {
    spawnSync(
      this.name,
      params.filter(param => typeof param === 'string' && param.length > 0),
      { cwd: cwd || appPaths.appDir, env: { ...process.env, NODE_ENV: 'development' } },
      onFail
    )
  }
}

class Npm extends PackageManager {
  name = 'npm'
  lockFile = 'package-lock.json'

  getInstallPackageParams(names, isDev) {
    return [
      'install',
      isDev ? '--save-dev' : '',
      ...names,
    ]
  }

  getUninstallPackageParams(names) {
    return ['uninstall', ...names]
  }
}

class Yarn extends PackageManager {
  name = 'yarn'
  lockFile = 'yarn.lock'

  getInstallPackageParams(names, isDev) {
    return [
      'add',
      isDev ? '--dev' : '',
      ...names
    ]
  }

  getUninstallPackageParams(names) {
    return ['remove', ...names]
  }
}

/**
 * @returns {PackageManager}
 */
function getPackager () {
  const yarn = new Yarn()
  const npm = new Npm()

  if (yarn.isUsed()) {
    return yarn
  }

  if (npm.isUsed()) {
    return npm
  }

  if (yarn.isInstalled()) {
    return yarn
  }

  if (npm.isInstalled()) {
    return npm
  }

  warn('Please install Yarn or NPM before running this command.\n')
}

module.exports = getPackager()
