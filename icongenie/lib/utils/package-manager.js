import fs from 'node:fs'
import { join, normalize, sep } from 'node:path'
import { sync as crossSpawnSync } from 'cross-spawn'

import { spawnSync } from './spawn-sync.js'

// returns a Promise!
function run({ name, params, cwd, env = 'development' }) {
  return spawnSync(
    name,
    params.filter(param => typeof param === 'string' && param.length !== 0),
    { cwd, env: { NODE_ENV: env } }
  )
}

function getMajorVersion(name) {
  try {
    const child = crossSpawnSync(name, ['--version'])
    if (child.status === 0) {
      const version = String(child.output[1]).trim()
      return Number.parseInt(version.split('.')[0], 10)
    }
  } catch {
    /* do nothing; we return null below */
  }

  return null
}

class PackageManager {
  appDir

  constructor(appDir) {
    this.appDir = appDir
  }

  /**
   * To be declared by subclasses
   */
  name = 'unknown'
  lockFiles = ['unknown']

  getInstallParams(/* env */) {
    return []
  }

  getInstallPackageParams(/* names, isDev, allowBuilds */) {
    return []
  }

  getUninstallPackageParams(/* names */) {
    return []
  }

  /**
   * Implementation of the actual package manager
   */

  majorVersion = null
  cachedIsInstalled = null

  isInstalled() {
    if (this.cachedIsInstalled !== null) {
      return this.cachedIsInstalled
    }

    this.majorVersion = getMajorVersion(this.name)
    this.cachedIsInstalled = this.majorVersion !== null

    return this.cachedIsInstalled
  }

  // returns a Promise!
  install({ cwd = this.appDir, params, env = 'development' } = {}) {
    return run({
      name: this.name,
      params:
        params && params.length !== 0 ? params : this.getInstallParams(env),
      cwd,
      env
    })
  }

  // returns a Promise!
  installPackage(
    name,
    { cwd = this.appDir, isDevDependency = false, allowBuilds = false } = {}
  ) {
    return run({
      name: this.name,
      params: this.getInstallPackageParams(
        Array.isArray(name) ? name : [name],
        isDevDependency,
        allowBuilds
      ),
      cwd
    })
  }

  // returns a Promise!
  uninstallPackage(name, { cwd = this.appDir } = {}) {
    return run({
      name: this.name,
      params: this.getUninstallPackageParams(
        Array.isArray(name) ? name : [name]
      ),
      cwd
    })
  }
}

class Npm extends PackageManager {
  name = 'npm'
  lockFiles = ['package-lock.json']

  getInstallParams(env) {
    if (env === 'development') {
      return ['install']
    }

    return this.majorVersion >= 9
      ? ['install'] // env will be set to production
      : ['install', '--production']
  }

  getInstallPackageParams(names, isDevDependency) {
    return ['install', isDevDependency ? '--save-dev' : '', ...names]
  }

  getUninstallPackageParams(names) {
    return ['uninstall', ...names]
  }
}

class Yarn extends PackageManager {
  name = 'yarn'
  lockFiles = ['yarn.lock']

  getInstallParams(env) {
    if (env === 'development') {
      return ['install']
    }

    return this.majorVersion >= 2
      ? ['workspaces', 'focus', '--all', '--production']
      : ['install', '--production']
  }

  getInstallPackageParams(names, isDevDependency) {
    return ['add', isDevDependency ? '--dev' : '', ...names]
  }

  getUninstallPackageParams(names) {
    return ['remove', ...names]
  }
}

// pnpm >= 11 exits with an error when any dependency in the tree has a build
// script that was not approved (pnpm 10 only warned about it), even though the
// packages did get installed — which would have us report "Failed to install"
// for a package that is in fact there. The user resolves the ignored builds
// with "pnpm approve-builds" on their own time; their own installs keep
// enforcing whatever they configured. It is a no-op next to
// "--dangerously-allow-all-builds" (nothing is ignored then), and unknown
// "--config.<key>" params are accepted by any pnpm version.
const pnpmIgnoredBuildsParam = '--config.strict-dep-builds=false'

class Pnpm extends PackageManager {
  name = 'pnpm'
  lockFiles = ['pnpm-lock.yaml']

  getInstallParams(env) {
    return env === 'development'
      ? ['install', pnpmIgnoredBuildsParam]
      : ['install', '--prod', pnpmIgnoredBuildsParam]
  }

  getInstallPackageParams(names, isDevDependency, allowBuilds) {
    return [
      'add',
      pnpmIgnoredBuildsParam,
      isDevDependency ? '--save-dev' : '',
      allowBuilds ? '--dangerously-allow-all-builds' : '',
      ...names
    ]
  }

  getUninstallPackageParams(names) {
    return ['remove', ...names]
  }
}

class Bun extends PackageManager {
  name = 'bun'
  lockFiles = ['bun.lock', 'bun.lockb']

  getInstallParams(env) {
    return env === 'development' ? ['install'] : ['install', '--production']
  }

  getInstallPackageParams(names, isDevDependency) {
    return ['add', isDevDependency ? '--dev' : '', ...names]
  }

  getUninstallPackageParams(names) {
    return ['remove', ...names]
  }
}

/**
 * @returns {PackageManager}
 */
function getProjectPackageManager(packageManagersList, dir) {
  // Recursively checks for presence of the lock file by traversing
  // the dir tree up to the root
  while (dir.length !== 0 && dir.at(-1) !== sep) {
    for (const pm of packageManagersList) {
      if (pm.lockFiles.some(lockFile => fs.existsSync(join(dir, lockFile)))) {
        return pm
      }
    }

    dir = normalize(join(dir, '..'))
  }
}

export function createInstance(appDir) {
  const packageManagersList = [
    new Yarn(appDir),
    new Pnpm(appDir),
    new Npm(appDir),
    new Bun(appDir)
  ]

  const projectPackageManager = getProjectPackageManager(
    packageManagersList,
    appDir
  )

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

  return 'Please install PNPM (recommended), Yarn, NPM or Bun before running this command.'
}
