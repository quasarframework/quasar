import fs from 'node:fs'
import { join, normalize, sep } from 'node:path'
import { sync as crossSpawnSync } from 'cross-spawn'

import { spawnSync } from './spawn-sync.js'

function isCommandInstalled(name) {
  try {
    return crossSpawnSync(name, ['--version']).status === 0
  } catch {
    return false
  }
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
  // spawn environment additions for every command of the packager
  extraEnv = {}

  getInstallPackageParams(/* names */) {
    return []
  }

  /**
   * Implementation of the actual package manager
   */

  cachedIsInstalled = null

  isInstalled() {
    if (this.cachedIsInstalled === null) {
      this.cachedIsInstalled = isCommandInstalled(this.name)
    }

    return this.cachedIsInstalled
  }

  // returns a Promise!
  installPackage(name, { cwd = this.appDir } = {}) {
    return spawnSync(
      this.name,
      this.getInstallPackageParams(Array.isArray(name) ? name : [name]),
      { cwd, env: { NODE_ENV: 'development', ...this.extraEnv } }
    )
  }
}

class Npm extends PackageManager {
  name = 'npm'
  lockFiles = ['package-lock.json']

  getInstallPackageParams(names) {
    return ['install', ...names]
  }
}

class Yarn extends PackageManager {
  name = 'yarn'
  lockFiles = ['yarn.lock']

  getInstallPackageParams(names) {
    return ['add', ...names]
  }
}

class Pnpm extends PackageManager {
  name = 'pnpm'
  lockFiles = ['pnpm-lock.yaml']

  // pnpm >= 11 exits with an error when any dependency in the tree has a
  // build script that was not approved (pnpm 10 only warned about it), even
  // though the packages did get installed -- which would have us report
  // "Failed to install" for a package that is in fact there. The user
  // resolves the ignored builds with "pnpm approve-builds" on their own time;
  // their own installs keep enforcing whatever they configured. The setting
  // goes through the environment: pnpm 12 stopped honouring it as a
  // "--config.<key>" param.
  extraEnv = { PNPM_CONFIG_STRICT_DEP_BUILDS: 'false' }

  getInstallPackageParams(names) {
    return ['add', ...names]
  }
}

class Bun extends PackageManager {
  name = 'bun'
  lockFiles = ['bun.lock', 'bun.lockb']

  getInstallPackageParams(names) {
    return ['add', ...names]
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
