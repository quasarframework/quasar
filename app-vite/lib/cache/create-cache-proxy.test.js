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

import { createCacheProxy } from './create-cache-proxy.js'

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'app-vite-cache-proxy-'))
)

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

function makeAppPaths(appDir) {
  return { appDir, resolve: { app: p => join(appDir, p) } }
}

// app with TypeScript + pinia installed
const tsStoreAppDir = join(rootDir, 'ts-store-app')
mkdirSync(tsStoreAppDir, { recursive: true })
writeFileSync(join(tsStoreAppDir, 'tsconfig.json'), '{}')

const piniaPkgDir = join(tsStoreAppDir, 'node_modules', 'pinia')
mkdirSync(piniaPkgDir, { recursive: true })
writeFileSync(
  join(piniaPkgDir, 'package.json'),
  JSON.stringify({ name: 'pinia', version: '4.0.0' })
)

// app without TypeScript and without pinia
const plainAppDir = join(rootDir, 'plain-app')
mkdirSync(plainAppDir, { recursive: true })

describe('[create-cache-proxy.js]', () => {
  test('getRuntime computes the value once', () => {
    const proxy = createCacheProxy({})
    let calls = 0
    const getValue = () => {
      calls++
      return 'computed'
    }

    expect(proxy.getRuntime('key', getValue)).toBe('computed')
    expect(proxy.getRuntime('key', getValue)).toBe('computed')
    expect(calls).toBe(1)
  })

  test('getRuntime caches falsy (but defined) values', () => {
    const proxy = createCacheProxy({})
    let calls = 0
    const getValue = () => {
      calls++
      return 0
    }

    expect(proxy.getRuntime('key', getValue)).toBe(0)
    expect(proxy.getRuntime('key', getValue)).toBe(0)
    expect(calls).toBe(1)
  })

  test('getRuntime re-runs an initializer that returned undefined', () => {
    const proxy = createCacheProxy({})
    let calls = 0
    const getValue = () => {
      calls++
    }

    proxy.getRuntime('key', getValue)
    proxy.getRuntime('key', getValue)
    expect(calls).toBe(2)
  })

  test('setRuntime seeds the runtime cache', () => {
    const proxy = createCacheProxy({})
    proxy.setRuntime('key', 'custom')
    expect(proxy.getRuntime('key', () => 'other')).toBe('custom')
  })

  test('getAsyncRuntime awaits and caches the value', async () => {
    const proxy = createCacheProxy({})
    let calls = 0
    const getValue = () => {
      calls++
      return Promise.resolve('async-value')
    }

    const first = await proxy.getAsyncRuntime('key', getValue)
    const second = await proxy.getAsyncRuntime('key', getValue)

    expect(first).toBe('async-value')
    expect(second).toBe('async-value')
    expect(calls).toBe(1)
  })

  test('getModule instantiates a cache module once per proxy', async () => {
    const proxy = createCacheProxy({ appPaths: makeAppPaths(tsStoreAppDir) })

    const first = await proxy.getModule('storeProvider')
    const second = await proxy.getModule('storeProvider')

    expect(first.name).toBe('pinia')
    expect(second).toBe(first)
  })

  test('getModule instantiates only once even for concurrent calls', async () => {
    const proxy = createCacheProxy({ appPaths: makeAppPaths(tsStoreAppDir) })

    // both calls start before either resolves
    const [first, second] = await Promise.all([
      proxy.getModule('storeProvider'),
      proxy.getModule('storeProvider')
    ])

    expect(second).toBe(first)
  })

  test('module caches are per proxy instance', async () => {
    const tsProxy = createCacheProxy({ appPaths: makeAppPaths(tsStoreAppDir) })
    const plainProxy = createCacheProxy({ appPaths: makeAppPaths(plainAppDir) })

    const tsResult = await tsProxy.getModule('hasTypescript')
    const plainResult = await plainProxy.getModule('hasTypescript')

    expect(tsResult).toBe(true)
    expect(plainResult).toBe(false)
  })

  test('getModule rejects for an unknown cache module', async () => {
    const proxy = createCacheProxy({})
    await expect(proxy.getModule('surelyNotACacheModule')).rejects.toThrow()
  })
})
