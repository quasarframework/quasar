import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest'

const state = vi.hoisted(() => ({
  // package manager name -> mocked "--version" output
  // (a missing entry means "not installed on this machine")
  versions: {},
  spawnCalls: []
}))

// stub the "<name> --version" detection so tests never spawn real binaries
vi.mock('cross-spawn', () => {
  const sync = name => {
    const version = state.versions[name]
    return version === void 0
      ? { status: 1, output: [] }
      : { status: 0, output: [null, `${version}\n`] }
  }
  return { default: { sync }, sync }
})

// capture install/uninstall commands instead of spawning real processes
vi.mock('../utils/spawn.js', () => ({
  spawnSync: (name, params, opts) => {
    state.spawnCalls.push({ name, params, opts })
    return Promise.resolve()
  }
}))

// the real fatal() would print and process.exit(1)
vi.mock('../utils/logger.js', () => ({
  fatal: msg => {
    throw new Error(`FATAL: ${msg}`)
  }
}))

import { createInstance } from './module.nodePackager.js'

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'app-vite-node-packager-'))
)

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

let dirId = 0
function makeAppDir(lockFiles = []) {
  const appDir = join(rootDir, `app-${dirId++}`)
  mkdirSync(appDir, { recursive: true })
  for (const lockFile of lockFiles) {
    writeFileSync(join(appDir, lockFile), '')
  }
  return appDir
}

function createPackager(lockFiles) {
  return createInstance({ appPaths: { appDir: makeAppDir(lockFiles) } })
}

beforeEach(() => {
  state.versions = {
    yarn: '1.22.22',
    pnpm: '10.4.1',
    npm: '11.1.0',
    bun: '1.2.4'
  }
  state.spawnCalls = []
})

describe('[module.nodePackager.js]', () => {
  describe('package manager detection', () => {
    test.each([
      ['yarn.lock', 'yarn'],
      ['pnpm-lock.yaml', 'pnpm'],
      ['package-lock.json', 'npm'],
      ['bun.lock', 'bun'],
      ['bun.lockb', 'bun']
    ])('%s selects %s', (lockFile, name) => {
      expect(createPackager([lockFile]).name).toBe(name)
    })

    test('detects the lock file in an ancestor directory', () => {
      const projectDir = makeAppDir(['package-lock.json'])
      const appDir = join(projectDir, 'src', 'components')
      mkdirSync(appDir, { recursive: true })

      expect(createInstance({ appPaths: { appDir } }).name).toBe('npm')
    })

    test('sets appDir and parses the major version', () => {
      const appDir = makeAppDir(['pnpm-lock.yaml'])
      const pm = createInstance({ appPaths: { appDir } })

      expect(pm.appDir).toBe(appDir)
      expect(pm.majorVersion).toBe(10)
      expect(pm.isInstalled()).toBe(true)
    })

    test('without a lock file uses the first installed package manager', () => {
      // priority order: yarn, pnpm, npm, bun
      expect(createPackager([]).name).toBe('yarn')

      delete state.versions.yarn
      delete state.versions.pnpm
      expect(createPackager([]).name).toBe('npm')
    })

    test('falls back when the lock file package manager is not installed', () => {
      delete state.versions.pnpm
      expect(createPackager(['pnpm-lock.yaml']).name).toBe('yarn')
    })

    test('fails when no package manager is installed', () => {
      state.versions = {}
      expect(() => createPackager([])).toThrow(/Please install PNPM/)
    })

    test('isInstalled() caches the detection result', () => {
      const pm = createPackager(['pnpm-lock.yaml'])

      // "uninstall" everything; the cached result must survive
      state.versions = {}
      expect(pm.isInstalled()).toBe(true)
      expect(pm.majorVersion).toBe(10)
    })
  })

  describe('command params', () => {
    test('npm builds its specific params', () => {
      const npm = createPackager(['package-lock.json'])

      expect(npm.getInstallParams('development')).toEqual(['install'])

      npm.majorVersion = 9
      expect(npm.getInstallParams('production')).toEqual(['install'])

      npm.majorVersion = 8
      expect(npm.getInstallParams('production')).toEqual([
        'install',
        '--production'
      ])

      expect(npm.getInstallPackageParams(['quasar'], false)).toEqual([
        'install',
        '',
        'quasar'
      ])
      expect(npm.getInstallPackageParams(['quasar'], true)).toEqual([
        'install',
        '--save-dev',
        'quasar'
      ])
      expect(npm.getUninstallPackageParams(['quasar'])).toEqual([
        'uninstall',
        'quasar'
      ])
    })

    test('yarn builds its specific params', () => {
      const yarn = createPackager(['yarn.lock'])

      expect(yarn.getInstallParams('development')).toEqual(['install'])

      yarn.majorVersion = 1
      expect(yarn.getInstallParams('production')).toEqual([
        'install',
        '--production'
      ])

      yarn.majorVersion = 2
      expect(yarn.getInstallParams('production')).toEqual([
        'workspaces',
        'focus',
        '--all',
        '--production'
      ])

      expect(yarn.getInstallPackageParams(['quasar'], false)).toEqual([
        'add',
        '',
        'quasar'
      ])
      expect(yarn.getInstallPackageParams(['quasar'], true)).toEqual([
        'add',
        '--dev',
        'quasar'
      ])
      expect(yarn.getUninstallPackageParams(['quasar'])).toEqual([
        'remove',
        'quasar'
      ])
    })

    test('pnpm builds its specific params', () => {
      const pnpm = createPackager(['pnpm-lock.yaml'])

      expect(pnpm.getInstallParams('development')).toEqual(['install'])
      expect(pnpm.getInstallParams('production')).toEqual(['install', '--prod'])

      expect(pnpm.getInstallPackageParams(['quasar'], false)).toEqual([
        'add',
        '',
        'quasar'
      ])
      expect(pnpm.getInstallPackageParams(['quasar'], true)).toEqual([
        'add',
        '--save-dev',
        'quasar'
      ])
      expect(pnpm.getUninstallPackageParams(['quasar'])).toEqual([
        'remove',
        'quasar'
      ])
    })

    test('bun builds its specific params', () => {
      const bun = createPackager(['bun.lock'])

      expect(bun.getInstallParams('development')).toEqual(['install'])
      expect(bun.getInstallParams('production')).toEqual([
        'install',
        '--production'
      ])

      expect(bun.getInstallPackageParams(['quasar'], false)).toEqual([
        'add',
        '',
        'quasar'
      ])
      expect(bun.getInstallPackageParams(['quasar'], true)).toEqual([
        'add',
        '--dev',
        'quasar'
      ])
      expect(bun.getUninstallPackageParams(['quasar'])).toEqual([
        'remove',
        'quasar'
      ])
    })
  })

  describe('command execution', () => {
    test('install() runs the manager install command in the app dir', async () => {
      const pm = createPackager(['pnpm-lock.yaml'])

      await pm.install()

      expect(state.spawnCalls).toEqual([
        {
          name: 'pnpm',
          params: ['install'],
          opts: { cwd: pm.appDir, env: { NODE_ENV: 'development' } }
        }
      ])
    })

    test('install() honors custom params, cwd and env', async () => {
      const pm = createPackager(['pnpm-lock.yaml'])

      await pm.install({ env: 'production' })
      await pm.install({ params: ['ci'], cwd: '/custom', env: 'production' })

      expect(state.spawnCalls).toEqual([
        {
          name: 'pnpm',
          params: ['install', '--prod'],
          opts: { cwd: pm.appDir, env: { NODE_ENV: 'production' } }
        },
        {
          name: 'pnpm',
          params: ['ci'],
          opts: { cwd: '/custom', env: { NODE_ENV: 'production' } }
        }
      ])
    })

    test('installPackage() filters out empty params', async () => {
      const npm = createPackager(['package-lock.json'])

      await npm.installPackage('quasar')
      expect(state.spawnCalls[0].params).toEqual(['install', 'quasar'])

      await npm.installPackage(['pkg-a', 'pkg-b'], { isDevDependency: true })
      expect(state.spawnCalls[1].params).toEqual([
        'install',
        '--save-dev',
        'pkg-a',
        'pkg-b'
      ])
    })

    test('uninstallPackage() runs the manager remove command', async () => {
      const pm = createPackager(['yarn.lock'])

      await pm.uninstallPackage('quasar', { cwd: '/elsewhere' })

      expect(state.spawnCalls).toEqual([
        {
          name: 'yarn',
          params: ['remove', 'quasar'],
          opts: { cwd: '/elsewhere', env: { NODE_ENV: 'development' } }
        }
      ])
    })
  })
})
