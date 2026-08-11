import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { getAppPaths } from './get-app-paths.js'
import { cliDir } from './cli-runtime.js'

vi.mock('./logger.js', () => ({
  fatal: vi.fn(msg => {
    throw new Error(`FATAL: ${msg}`)
  })
}))

// mirrors the implementation used by lib/utils/get-ctx.js
function defineHiddenProp(target, propName, value) {
  Object.defineProperty(target, propName, {
    value,
    configurable: false,
    enumerable: false,
    writable: false
  })
}

const prodSpaCtx = { dev: false, prod: true, modeName: 'spa' }

const originalCwd = process.cwd()
const tempDirs = []

// realpathSync() because on macOS the tmp dir lives behind
// the /var -> /private/var symlink while process.cwd() always
// reports the resolved path
function makeAppDir(configName = 'quasar.config.js') {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'q-app-paths-')))
  tempDirs.push(dir)

  if (configName !== null) {
    writeFileSync(join(dir, configName), 'export default {}\n')
  }

  return dir
}

function getPaths(ctx = prodSpaCtx) {
  return getAppPaths({ ctx, defineHiddenProp })
}

afterEach(() => {
  process.chdir(originalCwd)
  vi.clearAllMocks()

  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true })
  }
})

describe('[get-app-paths.js]', () => {
  test('detects quasar.config.js and flags the esm input format', () => {
    const appDir = makeAppDir('quasar.config.js')
    process.chdir(appDir)

    const paths = getPaths()

    expect(paths.appDir).toBe(appDir)
    expect(paths.quasarConfigFilename).toBe(join(appDir, 'quasar.config.js'))
    expect(paths.quasarConfigInputFormat).toBe('esm')
  })

  test('detects quasar.config.ts and flags the ts input format', () => {
    const appDir = makeAppDir('quasar.config.ts')
    process.chdir(appDir)

    const paths = getPaths()

    expect(paths.appDir).toBe(appDir)
    expect(paths.quasarConfigFilename).toBe(join(appDir, 'quasar.config.ts'))
    expect(paths.quasarConfigInputFormat).toBe('ts')
  })

  test('prefers quasar.config.js when both config files exist', () => {
    const appDir = makeAppDir('quasar.config.js')
    writeFileSync(join(appDir, 'quasar.config.ts'), 'export default {}\n')
    process.chdir(appDir)

    const paths = getPaths()

    expect(paths.quasarConfigFilename).toBe(join(appDir, 'quasar.config.js'))
    expect(paths.quasarConfigInputFormat).toBe('esm')
  })

  test('walks up from a nested cwd to the project root', () => {
    const appDir = makeAppDir()
    const nestedDir = join(appDir, 'src', 'components', 'deep')
    mkdirSync(nestedDir, { recursive: true })
    process.chdir(nestedDir)

    const paths = getPaths()

    expect(paths.appDir).toBe(appDir)
    expect(paths.quasarConfigFilename).toBe(join(appDir, 'quasar.config.js'))
  })

  test('fails when run outside of a Quasar project', () => {
    const emptyDir = makeAppDir(null)
    process.chdir(emptyDir)

    expect(() => getPaths()).toThrow(
      'FATAL: Error. This command must be executed inside a Quasar project folder.'
    )
  })

  test('namespaces cacheDir by run type, mode and optional target', () => {
    const appDir = makeAppDir()
    process.chdir(appDir)

    const cacheRoot = join(appDir, 'node_modules', '.q-cache')

    expect(getPaths({ dev: false, prod: true, modeName: 'spa' }).cacheDir).toBe(
      join(cacheRoot, 'prod-spa')
    )

    expect(getPaths({ dev: true, prod: false, modeName: 'spa' }).cacheDir).toBe(
      join(cacheRoot, 'dev-spa')
    )

    expect(
      getPaths({
        dev: true,
        prod: false,
        modeName: 'electron',
        targetName: 'darwin'
      }).cacheDir
    ).toBe(join(cacheRoot, 'dev-electron-darwin'))

    expect(
      getPaths({
        dev: false,
        prod: true,
        modeName: 'capacitor',
        targetName: 'ios'
      }).cacheDir
    ).toBe(join(cacheRoot, 'prod-capacitor-ios'))
  })

  test('exposes the CLI dir and mode source dirs of the app', () => {
    const appDir = makeAppDir()
    process.chdir(appDir)

    const paths = getPaths()

    expect(paths.cliDir).toBe(cliDir)
    expect(paths.srcDir).toBe(join(appDir, 'src'))
    expect(paths.publicDir).toBe(join(appDir, 'public'))
    expect(paths.pwaDir).toBe(join(appDir, 'src-pwa'))
    expect(paths.ssrDir).toBe(join(appDir, 'src-ssr'))
    expect(paths.ssgDir).toBe(join(appDir, 'src-ssg'))
    expect(paths.cordovaDir).toBe(join(appDir, 'src-cordova'))
    expect(paths.capacitorDir).toBe(join(appDir, 'src-capacitor'))
    expect(paths.electronDir).toBe(join(appDir, 'src-electron'))
    expect(paths.bexDir).toBe(join(appDir, 'src-bex'))
  })

  test('composes the resolve helpers from the matching base dirs', () => {
    const appDir = makeAppDir()
    process.chdir(appDir)

    const paths = getPaths()

    expect(paths.resolve.cli('templates/entry')).toBe(
      join(cliDir, 'templates/entry')
    )
    expect(paths.resolve.app('dist')).toBe(join(appDir, 'dist'))
    expect(paths.resolve.src('boot')).toBe(join(appDir, 'src', 'boot'))
    expect(paths.resolve.public('icons')).toBe(join(appDir, 'public', 'icons'))
    expect(paths.resolve.bex('manifest.json')).toBe(
      join(appDir, 'src-bex', 'manifest.json')
    )
    expect(paths.resolve.cache('vite')).toBe(
      join(appDir, 'node_modules', '.q-cache', 'prod-spa', 'vite')
    )
  })

  test('freezes the returned paths and the resolve object', () => {
    const appDir = makeAppDir()
    process.chdir(appDir)

    const paths = getPaths()

    expect(Object.isFrozen(paths)).toBe(true)
    expect(Object.isFrozen(paths.resolve)).toBe(true)
  })

  test('keeps the entry resolver hidden but functional', () => {
    const appDir = makeAppDir()
    process.chdir(appDir)

    const paths = getPaths()

    expect(paths.resolve.entry).toBeTypeOf('function')
    expect(Object.keys(paths.resolve)).not.toContain('entry')
    expect(paths.resolve.entry('client-entry.js')).toBe(
      join(appDir, '.quasar', 'prod-spa', 'client-entry.js')
    )
  })
})
