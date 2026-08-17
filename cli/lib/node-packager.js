import fs from 'node:fs'
import { join, normalize, sep } from 'node:path'
import { sync as crossSpawnSync } from 'cross-spawn'
import { execSync } from 'node:child_process'

import appPaths from './app-paths.js'
import { fatal } from './logger.js'
import { spawnSync } from './spawn.js'

const versionRegex = /^(\d+)\.[\d]+\.[\d]+-?(alpha|beta|rc)?/
const versionPartsRegex = /^(\d+)\.(\d+)\.(\d+)(?:-(.+))?/

function parseVersionParts(version) {
  const match = version.match(versionPartsRegex)
  if (match === null) return null

  return {
    core: [Number(match[1]), Number(match[2]), Number(match[3])],
    prerelease: match[4] ?? null
  }
}

function isNewerVersion(version, otherVersion) {
  for (let i = 0; i < 3; i++) {
    if (version.core[i] !== otherVersion.core[i]) {
      return version.core[i] > otherVersion.core[i]
    }
  }

  // a stable release supersedes its own pre-releases
  if ((version.prerelease === null) !== (otherVersion.prerelease === null)) {
    return version.prerelease === null
  }

  if (version.prerelease !== null) {
    return (
      version.prerelease.localeCompare(otherVersion.prerelease, 'en', {
        numeric: true
      }) > 0
    )
  }

  return false
}

// The NPM registry lists versions in publish order, which does not always
// match the version order (e.g. a patch for an older minor version can get
// released after a newer minor version), so the highest version needs to
// be picked explicitly.
function getHighestVersion(versionList) {
  let highest = null
  let highestParts = null

  for (const version of versionList) {
    const parts = parseVersionParts(version)
    if (parts === null) continue

    if (highest === null || isNewerVersion(parts, highestParts)) {
      highest = version
      highestParts = parts
    }
  }

  return highest
}

function getNpmRegistryUrl() {
  try {
    const url = String(execSync('npm config get registry')).trim()
    if (url) {
      return url.endsWith('/') ? url : url + '/'
    }
  } catch {}

  return 'https://registry.npmjs.org/'
}

async function getPackageVersionList(packageName, npmRegistryUrl) {
  try {
    const url = new URL(encodeURIComponent(packageName), npmRegistryUrl)
    const response = await fetch(url)
    if (!response.ok) return null

    const json = await response.json()
    const versionList = Object.keys(json.versions || {})

    return versionList.length !== 0 ? versionList : null
  } catch {
    return null
  }
}

// returns a Promise!
function run({ name, params, cwd, onFail, env = 'development' }) {
  return spawnSync(
    name,
    params.filter(param => typeof param === 'string' && param.length !== 0),
    { cwd: cwd || appPaths.appDir, env: { ...process.env, NODE_ENV: env } },
    onFail
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
  /**
   * To be declared by subclasses
   */
  name = 'unknown'
  lockFiles = ['unknown']

  getInstallParams(/* env */) {
    return []
  }

  getInstallPackageParams(/* names, isDev */) {
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
  #npmRegistryUrl = null

  isInstalled() {
    if (this.cachedIsInstalled !== null) {
      return this.cachedIsInstalled
    }

    this.majorVersion = getMajorVersion(this.name)
    this.cachedIsInstalled = this.majorVersion !== null

    return this.cachedIsInstalled
  }

  // returns a Promise!
  install({ cwd, params, env = 'development' } = {}) {
    return run({
      name: this.name,
      params:
        params && params.length !== 0 ? params : this.getInstallParams(env),
      cwd,
      env
    })
  }

  // returns a Promise!
  installPackage(name, { cwd, isDevDependency = false } = {}) {
    return run({
      name: this.name,
      params: this.getInstallPackageParams(
        Array.isArray(name) ? name : [name],
        isDevDependency
      ),
      cwd
    })
  }

  // returns a Promise!
  uninstallPackage(name, { cwd } = {}) {
    return run({
      name: this.name,
      params: this.getUninstallPackageParams(
        Array.isArray(name) ? name : [name]
      ),
      cwd
    })
  }

  get npmRegistryUrl() {
    if (this.#npmRegistryUrl === null) {
      this.#npmRegistryUrl = getNpmRegistryUrl()
    }
    return this.#npmRegistryUrl
  }

  set npmRegistryUrl(url) {
    if (url) {
      this.#npmRegistryUrl = url.endsWith('/') ? url : url + '/'
    }
  }

  async getPackageLatestVersion({
    packageName,
    npmRegistryUrl = this.npmRegistryUrl,
    currentVersion = null,
    majorVersion = false,
    preReleaseVersion = false
  }) {
    const versionList = await getPackageVersionList(packageName, npmRegistryUrl)
    if (versionList === null) return null

    if (currentVersion === null) {
      return getHighestVersion(versionList)
    }

    const versionMatch = currentVersion.match(versionRegex)
    if (versionMatch === null) return null

    const [, major, prerelease] = versionMatch
    const majorSyntax = majorVersion ? String.raw`(\d+)` : major
    const regex = new RegExp(
      prerelease || preReleaseVersion
        ? `^${majorSyntax}\\.(\\d+)\\.(\\d+)-?(alpha|beta|rc)?`
        : `^${majorSyntax}\\.(\\d+)\\.(\\d+)$`
    )

    const list = versionList.filter(version => regex.test(version))
    return getHighestVersion(list)
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
// packages did get installed. "quasar upgrade" must not abort over that, with
// the package.json versions already bumped but nothing installed to match —
// the user resolves it with "pnpm approve-builds" on their own time, and their
// own installs keep enforcing whatever they configured.
// Unknown "--config.<key>" params are accepted by any pnpm version.
const pnpmIgnoredBuildsParam = '--config.strict-dep-builds=false'

class Pnpm extends PackageManager {
  name = 'pnpm'
  lockFiles = ['pnpm-lock.yaml']

  getInstallParams(env) {
    return env === 'development'
      ? ['install', pnpmIgnoredBuildsParam]
      : ['install', '--prod', pnpmIgnoredBuildsParam]
  }

  getInstallPackageParams(names, isDevDependency) {
    return [
      'add',
      pnpmIgnoredBuildsParam,
      isDevDependency ? '--save-dev' : '',
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

const packageManagersList = [new Yarn(), new Pnpm(), new Npm(), new Bun()]

/**
 * @returns {PackageManager}
 */
function getProjectPackageManager(folder) {
  // Recursively checks for presence of the lock file by traversing
  // the folder tree up to the root
  while (folder.length !== 0 && folder.at(-1) !== sep) {
    for (const pm of packageManagersList) {
      if (
        pm.lockFiles.some(lockFile => fs.existsSync(join(folder, lockFile)))
      ) {
        return pm
      }
    }

    folder = normalize(join(folder, '..'))
  }
}

/**
 * @returns {PackageManager}
 */
export function getNodePackager(folder = appPaths.appDir) {
  // there might not be a project folder at all (e.g. outside of a project)
  const projectPackageManager =
    folder !== void 0 ? getProjectPackageManager(folder) : void 0

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

  fatal('Please install Yarn, PNPM, NPM or Bun before running this command.\n')
}

export const nodePackager = getNodePackager()
