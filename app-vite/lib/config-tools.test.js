import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import {
  createBrowserRolldownConfig,
  createViteConfig,
  getModeDepsAliases
} from './config-tools.js'
import { QuasarConfigFile } from './quasar-config-file.js'
import { getCtx } from './utils/get-ctx.js'

// minimal stand-in for a real Quasar app dir; isModeInstalled() checks
// appPaths.capacitorDir on disk, so the fixture creates/omits it for real
const appDir = mkdtempSync(join(tmpdir(), 'qav-config-tools-'))
const appPaths = {
  capacitorDir: join(appDir, 'src-capacitor'),
  resolve: { app: dir => join(appDir, dir) }
}

afterAll(() => {
  rmSync(appDir, { recursive: true, force: true })
})

describe('[config-tools.js] getModeDepsAliases()', () => {
  test('returns no aliases without installed modes or modeDeps', () => {
    expect(getModeDepsAliases(appPaths, { capacitorPkg: {} }, null)).toEqual({})
  })

  test('aliases explicit modeDeps into their src-<mode> folder', () => {
    const aliases = getModeDepsAliases(appPaths, { capacitorPkg: {} }, [
      { dir: 'src-pwa', deps: { 'register-service-worker': '^1.0.0' } },
      { dir: 'src-anything', deps: void 0 } // deps not installed yet
    ])

    expect(aliases).toEqual({
      'register-service-worker': join(
        appDir,
        'src-pwa/node_modules/register-service-worker'
      )
    })
  })

  describe('with Capacitor mode installed', () => {
    const capacitorPkg = {
      dependencies: {
        '@capacitor/app': '^8.0.0',
        '@capacitor/cli': '^8.0.0',
        '@capacitor/core': '^8.0.0'
      }
    }

    beforeAll(() => {
      mkdirSync(appPaths.capacitorDir)
    })

    test('aliases Capacitor deps no matter the mode being built', () => {
      // no modeDeps, like any non-Capacitor mode (SPA, SSR, ...) #17681
      const aliases = getModeDepsAliases(appPaths, { capacitorPkg }, null)

      expect(aliases).toEqual({
        '@capacitor/app': join(
          appDir,
          'src-capacitor/node_modules/@capacitor/app'
        ),
        '@capacitor/cli': join(
          appDir,
          'src-capacitor/node_modules/@capacitor/cli'
        ),
        '@capacitor/core': join(
          appDir,
          'src-capacitor/node_modules/@capacitor/core'
        )
      })
    })

    test("a mode's own deps win on a name clash", () => {
      const aliases = getModeDepsAliases(appPaths, { capacitorPkg }, [
        { dir: 'src-pwa', deps: { '@capacitor/app': '^8.0.0' } }
      ])

      expect(aliases['@capacitor/app']).toBe(
        join(appDir, 'src-pwa/node_modules/@capacitor/app')
      )
    })

    test('handles a not-yet-populated src-capacitor/package.json', () => {
      // ctx.pkg.capacitorPkg getter yields {} when the file is missing
      expect(getModeDepsAliases(appPaths, { capacitorPkg: {} }, null)).toEqual(
        {}
      )
    })
  })
})

describe('[config-tools.js] createViteConfig()', () => {
  // reading a config resolves the app from process.cwd(),
  // so run from within a real Quasar app (the js playground)
  const playgroundDir = join(import.meta.dirname, '../playground-js')
  const originalCwd = process.cwd()

  const readPlaygroundConf = () => {
    const configFile = new QuasarConfigFile({
      ctx: getCtx({ mode: 'spa', prod: true }),
      port: 9200,
      host: 'localhost'
    })
    return configFile.read()
  }

  const createConf = quasarConf =>
    createViteConfig(quasarConf, {
      compileId: 'vite-spa',
      shippedToClient: true
    })

  beforeAll(() => {
    process.chdir(playgroundDir)
  })

  afterAll(() => {
    process.chdir(originalCwd)
  })

  test('points Oxc at the Vue JSX runtime when build.vueJsx is set', async () => {
    // playground-js/quasar.config.js sets "vueJsx: true" (it carries a
    // breadcrumb comment pointing back here)
    const quasarConf = await readPlaygroundConf()
    expect(quasarConf.build.vueJsx).toEqual({
      runtime: 'automatic',
      importSource: 'vue'
    })

    const viteConf = await createConf(quasarConf)
    expect(viteConf.oxc.jsx).toEqual(quasarConf.build.vueJsx)
  })

  test('leaves the Oxc defaults alone when build.vueJsx is off', async () => {
    const quasarConf = await readPlaygroundConf()
    quasarConf.build.vueJsx = false

    const viteConf = await createConf(quasarConf)
    expect(viteConf.oxc).toBeUndefined()
  })

  test('hands over the JSX transformation on "preserve"', async () => {
    const quasarConf = await readPlaygroundConf()
    quasarConf.build.vueJsx = 'preserve'

    const viteConf = await createConf(quasarConf)
    expect(viteConf.oxc.jsx).toBe('preserve')
  })

  // the browser scripts that Rolldown builds on its own (BEX scripts, the
  // custom PWA service worker) get the same treatment
  test('carries build.vueJsx over to the Rolldown browser config', async () => {
    const quasarConf = await readPlaygroundConf()

    expect(
      createBrowserRolldownConfig(quasarConf, { shippedToClient: true })
        .transform.jsx
    ).toEqual(quasarConf.build.vueJsx)

    quasarConf.build.vueJsx = false
    expect(
      createBrowserRolldownConfig(quasarConf, { shippedToClient: true })
        .transform.jsx
    ).toBeUndefined()
  })
})
