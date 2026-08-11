import {
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
import { PromptsAPI } from './PromptsAPI.js'

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

function spyExit() {
  return vi.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit called')
  })
}

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
function makeApp() {
  const appDir = realpathSync(
    mkdtempSync(join(tmpdir(), 'app-vite-ae-prompts-'))
  )
  appDirs.push(appDir)

  writeFileSync(
    join(appDir, 'quasar.config.js'),
    'export default function () {\n  return {}\n}\n'
  )
  writeFileSync(
    join(appDir, 'package.json'),
    '{ "name": "ae-prompts-app", "version": "0.0.1", "private": true, "type": "module" }\n'
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
function makeApi({ json = {} } = {}) {
  const appDir = makeApp()
  process.chdir(appDir)

  const ctx = getCtx({ mode: 'spa', prod: true })
  const appExtJson = getAppExtJson({
    file: join(appDir, 'quasar.extensions.json'),
    json,
    onListUpdate: () => {}
  })
  const api = new PromptsAPI({ ctx, extId: 'qtest' }, appExtJson)

  return { api, appDir, appExtJson, ctx }
}

describe('[PromptsAPI.js] API', () => {
  test('exposes the base context fields', () => {
    const { api, ctx, appDir } = makeApi()

    expect(api.ctx).toBe(ctx)
    expect(api.extId).toBe('qtest')
    expect(api.appDir).toBe(appDir)
    expect(api.resolve).toBe(ctx.appPaths.resolve)
  })

  test('compatibleWith() passes silently when the condition is met', () => {
    const { api, appDir } = makeApi()
    addHostPackage(appDir, 'some-pkg', '2.3.0')

    expect(() => api.compatibleWith('some-pkg', '^2.0.0')).not.toThrow()
  })

  test('compatibleWith() halts on missing or incompatible packages', () => {
    const { api, appDir } = makeApi()
    addHostPackage(appDir, 'some-pkg', '1.0.0')
    const exitSpy = spyExit()

    expect(() => api.compatibleWith('some-pkg', '^2.0.0')).toThrow(
      'process.exit called'
    )
    expect(() => api.compatibleWith('missing-pkg', '^1.0.0')).toThrow(
      'process.exit called'
    )
    expect(exitSpy).toHaveBeenCalledWith(1)
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
})
