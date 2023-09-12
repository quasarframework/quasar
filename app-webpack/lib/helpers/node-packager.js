const fs = require('fs')
const { normalize, join, sep } = require('path')
const { sync: crossSpawnSync } = require('cross-spawn')

const appPaths = require('../app-paths')
const { log, fatal } = require('./logger')
const { spawnSync } = require('./spawn')

const versionRegex = /^(\d+)\.[\d]+\.[\d]+-?(alpha|beta|rc)?/

function run ({ name, params, cwd, onFail, env = 'development' }) {
  spawnSync(
    name,
    params.filter(param => typeof param === 'string' && param.length !== 0),
    { cwd: cwd || appPaths.appDir, env: { ...process.env, NODE_ENV: env } },
    onFail
  )
}

class PackageManager {
  /**
   * To be declared by subclasses
   */
  name = 'unknown'
  lockFile = 'unknown'

  getInstallParams (_env) {
    return []
  }

  getInstallPackageParams (_names, _isDev) {
    return []
  }

  getUninstallPackageParams (_names) {
    return []
  }

  getPackageVersionList (_packageName) {
    return null
  }

  /**
   * Implementation of the actual package manager
   */

  get majorVersion () {
    try {
      const child = crossSpawnSync(this.name, [ '--version' ])
      if (child.status === 0) {
        const version = String(child.output[ 1 ]).trim()
        return parseInt(version.split('.')[ 0 ], 10)
      }
    }
    catch (_) {
      /* do nothing; we return null below */
    }

    return null
  }

  isUsed () {
    let directory = appPaths.appDir

    // Recursively checks for presence of the lock file by traversing
    // the directory tree up to the root
    while (directory.length && directory[ directory.length - 1 ] !== sep) {
      if (fs.existsSync(join(directory, this.lockFile))) {
        return true
      }

      directory = normalize(join(directory, '..'))
    }

    return false
  }

  isInstalled () {
    return this.majorVersion !== null
  }

  install ({ cwd, params, displayName, env = 'development' } = {}) {
    displayName = displayName ? displayName + ' ' : ''

    log(`Installing ${ displayName }dependencies...`)
    run({
      name: this.name,
      params: params && params.length !== 0
        ? params
        : this.getInstallParams(env),
      cwd,
      env,
      onFail: () => fatal(`Failed to install ${ displayName }dependencies`, 'FAIL')
    })
  }

  installPackage (name, { cwd, displayName = name, isDevDependency = false } = {}) {
    log(`Installing ${ displayName }...`)
    run({
      name: this.name,
      params: this.getInstallPackageParams(Array.isArray(name) ? name : [ name ], isDevDependency),
      cwd,
      onFail: () => fatal(`Failed to install ${ displayName }`, 'FAIL')
    })
  }

  uninstallPackage (name, { cwd, displayName = name } = {}) {
    log(`Uninstalling ${ displayName }...`)
    run({
      name: this.name,
      params: this.getUninstallPackageParams(Array.isArray(name) ? name : [ name ]),
      cwd,
      onFail: () => fatal(`Failed to uninstall ${ displayName }`, 'FAIL')
    })
  }

  getPackageLatestVersion ({
    packageName,
    currentVersion = null,
    majorVersion = false,
    preReleaseVersion = false
  }) {
    const versionList = this.getPackageVersionList(packageName)

    if (versionList === null) {
      return null
    }

    if (currentVersion === null) {
      return versionList[ versionList.length - 1 ]
    }

    const [ , major, prerelease ] = currentVersion.match(versionRegex)
    const majorSyntax = majorVersion ? '(\\d+)' : major
    const regex = new RegExp(
      prerelease || preReleaseVersion
        ? `^${ majorSyntax }\\.(\\d+)\\.(\\d+)-?(alpha|beta|rc)?`
        : `^${ majorSyntax }\\.(\\d+)\\.(\\d+)$`
    )

    const list = versionList.filter(version => regex.test(version))
    return list[ list.length - 1 ] || null
  }
}

class Npm extends PackageManager {
  name = 'npm'
  lockFile = 'package-lock.json'

  getInstallParams (env) {
    if (env === 'development') {
      return [ 'install' ]
    }

    return this.majorVersion >= 9
      ? [ 'install' ] // env will be set to production
      : [ 'install', '--production' ]
  }

  getInstallPackageParams (names, isDevDependency) {
    return [
      'install',
      isDevDependency ? '--save-dev' : '',
      ...names
    ]
  }

  getUninstallPackageParams (names) {
    return [ 'uninstall', ...names ]
  }

  getPackageVersionList (packageName) {
    let versionList

    try {
      const child = crossSpawnSync(this.name, [ 'info', packageName, 'versions', '--json' ])
      if (child.status === 0) {
        versionList = JSON.parse(String(child.output[ 1 ]))
      }
    }
    catch (_) {
      return null
    }

    if (!versionList) return null
    if (versionList.type === 'error') return null

    return !versionList || !Array.isArray(versionList) || versionList.length === 0
      ? null
      : versionList
  }
}

class Yarn extends PackageManager {
  name = 'yarn'
  lockFile = 'yarn.lock'

  getInstallParams (env) {
    if (env === 'development') {
      return [ 'install' ]
    }

    return this.majorVersion >= 2
      ? [
          'workspaces',
          'focus',
          '--all',
          '--production'
        ]
      : [
          'install',
          '--production'
        ]
  }

  getInstallPackageParams (names, isDevDependency) {
    return [
      'add',
      isDevDependency ? '--dev' : '',
      ...names
    ]
  }

  getUninstallPackageParams (names) {
    return [ 'remove', ...names ]
  }

  getPackageVersionList (packageName) {
    let versionList

    try {
      const params = this.majorVersion >= 2
        ? [ 'npm', 'info', packageName, '--fields', 'versions', '--json' ]
        : [ 'info', packageName, 'versions', '--json' ]

      const child = crossSpawnSync(this.name, params)
      if (child.status === 0) {
        versionList = JSON.parse(String(child.output[ 1 ]))
      }
    }
    catch (_) {
      return null
    }

    if (!versionList) return null
    if (versionList.type === 'error') return null

    versionList = versionList[ this.majorVersion >= 2 ? 'versions' : 'data' ]

    return !versionList || !Array.isArray(versionList) || versionList.length === 0
      ? null
      : versionList
  }
}

class Pnpm extends PackageManager {
  name = 'pnpm'
  lockFile = 'pnpm-lock.yaml'

  getInstallParams (env) {
    return env === 'development'
      ? [ 'install' ]
      : [ 'install', '--prod' ]
  }

  getInstallPackageParams (names, isDevDependency) {
    return [
      'add',
      isDevDependency ? '--save-dev' : '',
      ...names
    ]
  }

  getUninstallPackageParams (names) {
    return [ 'remove', ...names ]
  }

  getPackageVersionList (packageName) {
    let versionList

    try {
      const child = crossSpawnSync(this.name, [ 'info', packageName, 'versions', '--json' ])
      if (child.status === 0) {
        versionList = JSON.parse(String(child.output[ 1 ]))
      }
    }
    catch (_) {
      return null
    }

    if (!versionList) return null
    if (versionList.type === 'error') return null

    return !versionList || !Array.isArray(versionList) || versionList.length === 0
      ? null
      : versionList
  }
}

class Bun extends PackageManager {
  name = 'bun'
  lockFile = 'bun.lockb'

  getInstallParams (env) {
    return env === 'development'
      ? [ 'install' ]
      : [ 'install', '--production' ]
  }

  getInstallPackageParams (names, isDevDependency) {
    return [
      'add',
      isDevDependency ? '--dev' : '',
      ...names
    ]
  }

  getUninstallPackageParams (names) {
    return [ 'remove', ...names ]
  }

  getPackageVersionList (_packageName) {
    // Bun v1.0.0 does not have a way to get the list of versions
    return null
  }
}

/**
 * @returns {PackageManager}
 */
function getPackager () {
  const yarn = new Yarn()

  if (yarn.isUsed()) {
    return yarn
  }

  const pnpm = new Pnpm()

  if (pnpm.isUsed()) {
    return pnpm
  }

  const npm = new Npm()

  if (npm.isUsed()) {
    return npm
  }

  const bun = new Bun()

  if (bun.isUsed()) {
    return bun
  }

  if (yarn.isInstalled()) {
    return yarn
  }

  if (pnpm.isInstalled()) {
    return pnpm
  }

  if (npm.isInstalled()) {
    return npm
  }

  if (bun.isInstalled()) {
    return bun
  }

  fatal('Please install Yarn, PNPM, or NPM before running this command.\n')
}

module.exports = getPackager()
