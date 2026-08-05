import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { getCtx } from './get-ctx.js'

// getCtx() resolves the app from process.cwd(), so run it
// from within a real Quasar app (the js playground)
const playgroundDir = join(import.meta.dirname, '../../playground-js')
const originalCwd = process.cwd()

beforeAll(() => {
  process.chdir(playgroundDir)
})

afterAll(() => {
  process.chdir(originalCwd)
})

describe('[get-ctx.js]', () => {
  test('builds a frozen context with the requested mode flagged', () => {
    const ctx = getCtx({ mode: 'spa' })

    expect(Object.isFrozen(ctx)).toBe(true)
    expect(ctx.modeName).toBe('spa')
    expect(ctx.mode.spa).toBe(true)

    for (const mode of Object.keys(ctx.mode).filter(m => m !== 'spa')) {
      expect(ctx.mode[mode]).toBe(false)
    }
  })

  test('defaults to prod when neither dev nor prod is requested', () => {
    const ctx = getCtx({ mode: 'spa' })
    expect(ctx.prod).toBe(true)
    expect(ctx.dev).toBe(false)
  })

  test('honors an explicit dev request', () => {
    const ctx = getCtx({ mode: 'spa', dev: true })
    expect(ctx.dev).toBe(true)
    expect(ctx.prod).toBe(false)
  })

  test('flags the requested target, arch and bundler', () => {
    const ctx = getCtx({
      mode: 'electron',
      target: 'darwin',
      arch: 'arm64',
      bundler: 'builder'
    })

    expect(ctx.targetName).toBe('darwin')
    expect(ctx.target.darwin).toBe(true)
    expect(ctx.arch.arm64).toBe(true)
    expect(ctx.bundler.builder).toBe(true)
  })

  test('resolves the app paths of the surrounding project', () => {
    const ctx = getCtx({ mode: 'spa' })

    expect(ctx.appPaths.appDir).toBe(playgroundDir)
    expect(ctx.appPaths.quasarConfigFilename).toBe(
      join(playgroundDir, 'quasar.config.js')
    )
    expect(ctx.appPaths.resolve.app('dist')).toBe(join(playgroundDir, 'dist'))
    expect(ctx.appPaths.resolve.src('boot')).toBe(
      join(playgroundDir, 'src', 'boot')
    )
  })

  test('namespaces the cache dir by run type, mode and target', () => {
    const prodSpa = getCtx({ mode: 'spa' })
    expect(prodSpa.appPaths.cacheDir).toBe(
      join(playgroundDir, 'node_modules', '.q-cache', 'prod-spa')
    )

    const devCapacitor = getCtx({ mode: 'capacitor', target: 'ios', dev: true })
    expect(devCapacitor.appPaths.cacheDir).toBe(
      join(playgroundDir, 'node_modules', '.q-cache', 'dev-capacitor-ios')
    )
  })

  test('keeps pkg, cacheProxy and appExt as hidden props', () => {
    const ctx = getCtx({ mode: 'spa' })

    for (const hidden of ['pkg', 'cacheProxy', 'appExt']) {
      expect(ctx[hidden]).toBeDefined()
      expect(Object.keys(ctx)).not.toContain(hidden)
    }
  })

  test('exposes a frozen public logger', () => {
    const ctx = getCtx({ mode: 'spa' })

    expect(Object.isFrozen(ctx.logger)).toBe(true)
    for (const fn of ['log', 'warn', 'fatal', 'info', 'error']) {
      expect(ctx.logger[fn]).toBeTypeOf('function')
    }
  })
})
