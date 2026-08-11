import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, describe, expect, test } from 'vitest'

import { getCtx } from '../../utils/get-ctx.js'
import { BaseAPI } from './BaseAPI.js'

const originalCwd = process.cwd()

const appDirs = []
afterEach(() => {
  process.chdir(originalCwd)
})
afterAll(() => {
  for (const dir of appDirs) {
    rmSync(dir, { recursive: true, force: true })
  }
})

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
function makeApp() {
  const appDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-ae-base-')))
  appDirs.push(appDir)

  writeFileSync(
    join(appDir, 'quasar.config.js'),
    'export default function () {\n  return {}\n}\n'
  )
  writeFileSync(
    join(appDir, 'package.json'),
    '{ "name": "ae-base-app", "version": "0.0.1", "private": true, "type": "module" }\n'
  )
  writeFileSync(
    join(appDir, 'index.html'),
    '<html><body><!-- quasar:entry-point --></body></html>\n'
  )
  mkdirSync(join(appDir, 'src'))
  mkdirSync(join(appDir, 'node_modules'))

  return appDir
}

function addHostPackage(appDir, name, version) {
  const pkgDir = join(appDir, 'node_modules', name)
  mkdirSync(pkgDir, { recursive: true })
  writeFileSync(
    join(pkgDir, 'package.json'),
    JSON.stringify({ name, version, main: 'index.js' })
  )
  writeFileSync(join(pkgDir, 'index.js'), '')
}

// getCtx() resolves the app from process.cwd()
function makeApi(appDir = makeApp()) {
  process.chdir(appDir)
  const ctx = getCtx({ mode: 'spa', prod: true })
  return { appDir, ctx, api: new BaseAPI({ ctx, extId: 'qtest' }) }
}

describe('[BaseAPI.js] API', () => {
  test('wires up the context-derived public fields', () => {
    const { api, ctx, appDir } = makeApi()

    expect(api.ctx).toBe(ctx)
    expect(api.extId).toBe('qtest')
    expect(api.resolve).toBe(ctx.appPaths.resolve)
    expect(api.appDir).toBe(appDir)
    expect(api.appDir).toBe(ctx.appPaths.appDir)

    // the extension-branded logger
    expect(Object.isFrozen(api.logger)).toBe(true)
    for (const method of [
      'log',
      'warn',
      'fatal',
      'info',
      'success',
      'error',
      'warning',
      'tip',
      'progress'
    ]) {
      expect(api.logger[method], `logger.${method}`).toBeTypeOf('function')
    }
  })

  test('hasTypescript() reflects the presence of tsconfig.json', async () => {
    const { api } = makeApi()
    await expect(api.hasTypescript()).resolves.toBe(false)

    const tsAppDir = makeApp()
    writeFileSync(join(tsAppDir, 'tsconfig.json'), '{}\n')
    const { api: tsApi } = makeApi(tsAppDir)
    await expect(tsApi.hasTypescript()).resolves.toBe(true)
  })

  // no negative case: getPackagePath()'s resolution fallbacks can reach
  // the CLI's own dependency tree, and this repo holds pinia (playground dep)
  test('getStorePackageName() detects pinia', () => {
    const appDir = makeApp()
    addHostPackage(appDir, 'pinia', '3.0.0')
    const { api } = makeApi(appDir)

    expect(api.getStorePackageName()).toBe('pinia')
  })

  test('getNodePackagerName() reports the packager owning the lock file', async () => {
    const appDir = makeApp()
    writeFileSync(join(appDir, 'package-lock.json'), '{}\n')
    const { api } = makeApi(appDir)

    await expect(api.getNodePackagerName()).resolves.toBe('npm')
  })
})
