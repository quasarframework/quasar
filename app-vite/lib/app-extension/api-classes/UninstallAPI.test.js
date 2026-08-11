import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest'

import { getCtx } from '../../utils/get-ctx.js'
import { getAppExtJson } from '../create-app-ext.js'
import { UninstallAPI } from './UninstallAPI.js'

const originalCwd = process.cwd()

const appDirs = []
beforeEach(() => {
  // silence the CLI output
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  vi.restoreAllMocks()
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
  const appDir = realpathSync(
    mkdtempSync(join(tmpdir(), 'app-vite-ae-uninstall-'))
  )
  appDirs.push(appDir)

  writeFileSync(
    join(appDir, 'quasar.config.js'),
    'export default function () {\n  return {}\n}\n'
  )
  writeFileSync(
    join(appDir, 'package.json'),
    '{ "name": "ae-uninstall-app", "version": "0.0.1", "private": true, "type": "module" }\n'
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
function makeApi({ json = {}, prompts = {} } = {}) {
  const appDir = makeApp()
  process.chdir(appDir)

  const ctx = getCtx({ mode: 'spa', prod: true })
  const appExtJson = getAppExtJson({
    file: join(appDir, 'quasar.extensions.json'),
    json,
    onListUpdate: () => {}
  })
  const api = new UninstallAPI({ ctx, extId: 'qtest', prompts }, appExtJson)

  return { api, appDir, appExtJson, ctx }
}

describe('[UninstallAPI.js] API', () => {
  test('exposes the prompts answers', () => {
    const prompts = { featureX: true }
    const { api } = makeApi({ prompts })

    expect(api.prompts).toBe(prompts)
  })

  test('getPersistentConf() reads the internal config', () => {
    const { api } = makeApi({
      json: { qtest: { __internal: { some: 'value' } } }
    })

    expect(api.getPersistentConf()).toEqual({ some: 'value' })
  })

  test('getPersistentConf() returns an empty object when never set', () => {
    const { api } = makeApi()
    expect(api.getPersistentConf()).toEqual({})
  })

  test('hasPackage() / getPackageVersion() inspect host packages', () => {
    const { api, appDir } = makeApi()
    addHostPackage(appDir, 'some-pkg', '2.3.0')

    expect(api.hasPackage('some-pkg')).toBe(true)
    expect(api.hasPackage('some-pkg', '^2.0.0')).toBe(true)
    expect(api.hasPackage('some-pkg', '^3.0.0')).toBe(false)
    expect(api.hasPackage('missing-pkg')).toBe(false)
    expect(api.getPackageVersion('some-pkg')).toBe('2.3.0')
    expect(api.getPackageVersion('missing-pkg')).toBeUndefined()
  })

  test('hasExtension() checks the registered extensions list', () => {
    const { api } = makeApi({ json: { 'other-ext': {} } })

    expect(api.hasExtension('other-ext')).toBe(true)
    expect(api.hasExtension('unknown-ext')).toBe(false)
  })

  test('removePath() deletes files and folders relative to the app root', () => {
    const { api, appDir } = makeApi()
    writeFileSync(join(appDir, 'installed-file.txt'), 'hi\n')
    mkdirSync(join(appDir, 'installed-folder/deep'), { recursive: true })
    writeFileSync(join(appDir, 'installed-folder/deep/file.txt'), 'hi\n')

    api.removePath('installed-file.txt')
    api.removePath('installed-folder')

    expect(existsSync(join(appDir, 'installed-file.txt'))).toBe(false)
    expect(existsSync(join(appDir, 'installed-folder'))).toBe(false)

    // non-existing paths are a no-op
    expect(() => api.removePath('never-existed')).not.toThrow()
  })

  test('onExitLog() collects messages', () => {
    const { api, appExtJson } = makeApi()

    api.onExitLog('first')
    api.onExitLog('second')

    expect(api.__getHooks(appExtJson).exitLog).toEqual(['first', 'second'])
  })

  test('__getHooks() rejects foreign access tokens', () => {
    const { api } = makeApi()
    expect(api.__getHooks({})).toBeUndefined()
  })
})
