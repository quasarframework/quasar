import fs from 'node:fs'
import { normalize, join, sep } from 'node:path'
import { sync as crossSpawnSync } from 'cross-spawn'

import { log, fatal } from '../utils/logger.js'
import { spawnSync } from '../utils/spawn.js'

const versionRegex = /^(\d+)\.[\d]+\.[\d]+-?(alpha|beta|rc)?/

function run ({ name, params, cwd, onFail, env = 'development' }) {
  spawnSync(
    name,
    params.filter(param => typeof param === 'string' && param.length !== 0),
    { cwd, env: { ...process.env, NODE_ENV: env } },
    onFail
  )
}

function getMajorVersion (name) {
  try {
    const child = crossSpawnSync(name, [ '--version' ])
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

class PackageManager {
  appDir

  constructor (appDir) {
    this.appDir = appDir
  }

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

  majorVersion = null
  cachedIsInstalled = null

  isInstalled () {
    if (this.cachedIsInstalled !== null) {
      return this.cachedIsInstalled
    }

    this.majorVersion = getMajorVersion(this.name)
    this.cachedIsInstalled = this.majorVersion !== null

    return this.cachedIsInstalled
  }

  install ({ cwd = this.appDir, params, displayName, env = 'development' } = {}) {
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

  installPackage (name, { cwd = this.appDir, displayName = name, isDevDependency = false } = {}) {
    log(`Installing ${ displayName }...`)
    run({
      name: this.name,
      params: this.getInstallPackageParams(Array.isArray(name) ? name : [ name ], isDevDependency),
      cwd,
      onFail: () => fatal(`Failed to install ${ displayName }`, 'FAIL')
    })
  }

  uninstallPackage (name, { cwd = this.appDir, displayName = name } = {}) {
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

/**
 * @returns {PackageManager}
 */
function getProjectPackageManager (packageManagersList, dir) {
  // Recursively checks for presence of the lock file by traversing
  // the dir tree up to the root
  while (dir.length && dir[ dir.length - 1 ] !== sep) {
    for (const pm of packageManagersList) {
      if (fs.existsSync(join(dir, pm.lockFile))) {
        return pm
      }
    }

    dir = normalize(join(dir, '..'))
  }
}

export function createInstance ({ appPaths }) {
  const { appDir } = appPaths

  const packageManagersList = [
    new Yarn(appDir),
    new Pnpm(appDir),
    new Npm(appDir)
  ]

  const projectPackageManager = getProjectPackageManager(packageManagersList, appDir)

  // if the project folder uses a supported package manager
  // and it is installed on this machine then use it
  if (projectPackageManager !== void 0 && projectPackageManager.isInstalled()) {
    return projectPackageManager
  }

  // otherwise, use the first installed package manager
  for (const pm of packageManagersList) {
    if (pm.isInstalled()) {
      return pm
    }
  }

  fatal('Please install Yarn, PNPM, or NPM before running this command.\n')
}
