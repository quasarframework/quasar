import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, describe, expect, test } from 'vitest'

import { QuasarConfigFile } from './quasar-config-file.js'
import { getCtx } from './utils/get-ctx.js'
import { generateTypes } from './types-generator.js'

const playgroundDir = join(import.meta.dirname, '../playground-js')
const cliDir = join(import.meta.dirname, '..')
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

// a minimal app fixture: unlike the playgrounds, it guarantees which
// modes are installed (none, unless a test creates a src-* dir)
function makeApp(configContent) {
  const appDir = realpathSync(
    mkdtempSync(join(tmpdir(), 'app-vite-types-generator-'))
  )
  appDirs.push(appDir)

  writeFileSync(
    join(appDir, 'quasar.config.js'),
    configContent ?? 'export default function () {\n  return {}\n}\n'
  )
  writeFileSync(
    join(appDir, 'package.json'),
    '{ "name": "types-generator-app", "version": "0.0.1", "private": true, "type": "module" }\n'
  )
  writeFileSync(
    join(appDir, 'index.html'),
    '<html><body><!-- quasar:entry-point --></body></html>\n'
  )
  mkdirSync(join(appDir, 'src'))

  mkdirSync(join(appDir, 'node_modules/@quasar'), { recursive: true })
  symlinkSync(
    realpathSync(join(playgroundDir, 'node_modules/quasar')),
    join(appDir, 'node_modules/quasar')
  )
  symlinkSync(cliDir, join(appDir, 'node_modules/@quasar/app-vite'))

  return appDir
}

// reads the config in-process from within the app, then generates
// the .quasar types — what "quasar prepare" does
async function generate(appDir) {
  process.chdir(appDir)
  const ctx = getCtx({ mode: 'spa', prod: true })
  const configFile = new QuasarConfigFile({
    ctx,
    port: 9000,
    host: 'localhost'
  })
  const quasarConf = await configFile.read()
  generateTypes(quasarConf)
  return appDir
}

const readGenerated = (appDir, file) =>
  readFileSync(join(appDir, '.quasar', file), 'utf8')

describe('[types-generator.js] generateTypes()', () => {
  test('generates the base tsconfig with the CLI paths', async () => {
    const appDir = await generate(makeApp())

    const tsconfig = JSON.parse(readGenerated(appDir, 'tsconfig.json'))
    expect(tsconfig.compilerOptions.paths['#q-app']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@/*']).toEqual(['./../src/*'])
    expect(tsconfig.include).toBeDefined()

    // CLI augmentations + vite client types
    const declarations = readGenerated(appDir, 'quasar.d.ts')
    expect(declarations).toContain('reference types="@quasar/app-vite"')
    expect(declarations).toContain('reference types="@quasar/app-vite/client"')

    // no store, no modes installed
    const featureFlags = readGenerated(appDir, 'feature-flags.d.ts')
    expect(featureFlags).toContain('// no feature flags')
    expect(existsSync(join(appDir, '.quasar/shims-vue.d.ts'))).toBe(false)
    expect(existsSync(join(appDir, '.quasar/pinia.d.ts'))).toBe(false)
  })

  test('flags installed modes and the store', async () => {
    const appDir = makeApp()

    // installed modes are detected by their folder
    mkdirSync(join(appDir, 'src-pwa'))
    mkdirSync(join(appDir, 'src-ssr'))
    // a store is detected by its entry file
    mkdirSync(join(appDir, 'src/stores'))
    writeFileSync(join(appDir, 'src/stores/index.js'), 'export default {}\n')

    await generate(appDir)

    const featureFlags = readGenerated(appDir, 'feature-flags.d.ts')
    expect(featureFlags).toContain('pwa: true;')
    expect(featureFlags).toContain('ssr: true;')
    expect(featureFlags).toContain('store: true;')
    expect(featureFlags).not.toContain('bex: true;')
  })

  test('configures the tsconfig for JSX/TSX when build.vueJsx is set', async () => {
    const appDir = await generate(makeApp())

    // opt-in: nothing JSX related by default
    const defaultTsConfig = JSON.parse(readGenerated(appDir, 'tsconfig.json'))
    expect(defaultTsConfig.compilerOptions.jsx).toBeUndefined()
    expect(defaultTsConfig.compilerOptions.jsxImportSource).toBeUndefined()

    const jsxAppDir = await generate(
      makeApp(
        'export default function () {\n' +
          '  return { build: { vueJsx: true } }\n' +
          '}\n'
      )
    )

    const tsConfig = JSON.parse(readGenerated(jsxAppDir, 'tsconfig.json'))
    // Vite compiles the JSX, so tsc/vue-tsc only type-checks it
    expect(tsConfig.compilerOptions.jsx).toBe('preserve')
    expect(tsConfig.compilerOptions.jsxImportSource).toBe('vue')
  })

  test('honors a custom JSX import source', async () => {
    const appDir = await generate(
      makeApp(
        'export default function () {\n' +
          "  return { build: { vueJsx: { importSource: 'some-other-vue' } } }\n" +
          '}\n'
      )
    )

    const tsConfig = JSON.parse(readGenerated(appDir, 'tsconfig.json'))
    expect(tsConfig.compilerOptions.jsxImportSource).toBe('some-other-vue')
  })

  test('honors build.typescript strict + vueShim options', async () => {
    const appDir = await generate(
      makeApp(
        'export default function () {\n' +
          '  return { build: { typescript: { strict: true, vueShim: true } } }\n' +
          '}\n'
      )
    )

    const tsconfig = JSON.parse(readGenerated(appDir, 'tsconfig.json'))
    expect(tsconfig.compilerOptions.strict).toBe(true)

    const shim = readGenerated(appDir, 'shims-vue.d.ts')
    expect(shim).toContain("declare module '*.vue'")
  })
})
