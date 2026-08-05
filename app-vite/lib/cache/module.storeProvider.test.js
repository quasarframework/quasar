import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { createInstance as createStoreProvider } from './module.storeProvider.js'

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'app-vite-store-provider-'))
)

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

function makeAppPaths(appDir) {
  return { appDir, resolve: { app: p => join(appDir, p) } }
}

// app with pinia installed
const storeAppDir = join(rootDir, 'store-app')
const piniaPkgDir = join(storeAppDir, 'node_modules', 'pinia')
mkdirSync(piniaPkgDir, { recursive: true })
writeFileSync(
  join(piniaPkgDir, 'package.json'),
  JSON.stringify({ name: 'pinia', version: '4.0.0' })
)

// app without pinia
const plainAppDir = join(rootDir, 'plain-app')
mkdirSync(plainAppDir, { recursive: true })

describe('[module.storeProvider.js]', () => {
  test('describes the pinia store provider', () => {
    const instance = createStoreProvider({
      appPaths: makeAppPaths(plainAppDir)
    })

    expect(instance.name).toBe('pinia')
    expect(instance.pathKey).toBe('stores')
  })

  /**
   * The "not installed" counterpart cannot be asserted in-process:
   * vitest points NODE_PATH at the monorepo pnpm store, so pinia
   * resolves even from a bare temp dir (see cli/AGENTS.md gotchas).
   */
  test('isInstalled is true when the store package is resolvable', () => {
    const installed = createStoreProvider({
      appPaths: makeAppPaths(storeAppDir)
    })

    expect(installed.isInstalled).toBe(true)
  })

  test('install() delegates to the nodePackager cache module', async () => {
    const installedPackages = []
    const fakeNodePackager = {
      installPackage: name => {
        installedPackages.push(name)
        return Promise.resolve()
      }
    }

    const instance = createStoreProvider({
      appPaths: makeAppPaths(plainAppDir),
      cacheProxy: { getModule: () => Promise.resolve(fakeNodePackager) }
    })

    await instance.install()
    expect(installedPackages).toEqual(['pinia'])
  })
})
