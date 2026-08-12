import { createServer } from 'node:net'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import {
  QuasarConfigFile,
  formatPublicPath,
  formatRouterBase
} from './quasar-config-file.js'
import { getCtx } from './utils/get-ctx.js'

// reading the config resolves the app from process.cwd(),
// so run from within a real Quasar app (the js playground)
const playgroundDir = join(import.meta.dirname, '../playground-js')
const originalCwd = process.cwd()

// Values mirrored from playground-js/quasar.config.js (which carries
// breadcrumb comments pointing back here) — they prove the pipeline
// carries configured values through unchanged
const playgroundConfig = {
  ssrProdPort: 3000,
  electronInspectPort: 5858,
  electronPreloadScripts: ['electron-preload'],
  pwaWorkboxMode: 'GenerateSW'
}

beforeAll(() => {
  process.chdir(playgroundDir)
})

afterAll(() => {
  process.chdir(originalCwd)
})

// compiles the real playground quasar.config.js through rolldown and
// runs the full normalization — no build is triggered
function readConf(ctxOpts, opts) {
  const ctx = getCtx(ctxOpts)
  const configFile = new QuasarConfigFile({
    ctx,
    port: 9100,
    host: 'localhost',
    ...opts
  })
  return configFile.read()
}

describe('[quasar-config-file.js] formatPublicPath()', () => {
  test.each([
    ['empty stays root', '', '/'],
    ['undefined stays root', void 0, '/'],
    ['root stays root', '/', '/'],
    ['missing slashes get added', 'sub/path', '/sub/path/'],
    ['leading slash is kept', '/sub', '/sub/'],
    ['trailing slash is kept', 'sub/', '/sub/'],
    [
      'full URLs are kept, only slash-terminated',
      'https://cdn.acme.com/assets',
      'https://cdn.acme.com/assets/'
    ]
  ])('%s', (_, input, expected) => {
    expect(formatPublicPath(input)).toBe(expected)
  })
})

describe('[quasar-config-file.js] formatRouterBase()', () => {
  test('passes through non-URL bases', () => {
    expect(formatRouterBase('/sub/')).toBe('/sub/')
    expect(formatRouterBase('')).toBe('')
  })

  test('extracts the path of a full URL', () => {
    expect(formatRouterBase('https://cdn.acme.com/assets/')).toBe('/assets/')
    expect(formatRouterBase('https://cdn.acme.com:8080/')).toBe('/')
  })
})

describe('[quasar-config-file.js] read()', () => {
  test('spa dev: devServer + APP_URL + define flags', async () => {
    const conf = await readConf({ mode: 'spa', dev: true })

    expect(conf.devServer.port).toBe(9100)
    expect(conf.devServer.host).toBe('localhost')
    // browser-open directive is consumed into metaConf; in a
    // non-interactive run (CI or piped stdio) it resolves to false
    expect(conf.devServer.open).toBeUndefined()
    expect(conf.metaConf.openBrowser).toBe(false)

    expect(conf.metaConf.APP_URL).toBe('http://localhost:9100/')

    expect(conf.build.define['import.meta.env.QUASAR_DEV']).toBe('true')
    expect(conf.build.define['import.meta.env.QUASAR_PROD']).toBe('false')
    expect(conf.build.define['import.meta.env.QUASAR_MODE']).toBe('"spa"')
    expect(conf.build.define['import.meta.env.QUASAR_APP_URL']).toBe(
      '"http://localhost:9100/"'
    )

    // the playground has no store
    expect(conf.metaConf.hasStore).toBe(false)
    expect(conf.metaConf.hasTypescript).toBe(false)
  })

  test('capacitor dev: CLI preparation params + iosBuildScheme defaults', async () => {
    const conf = await readConf({
      mode: 'capacitor',
      dev: true,
      target: 'android'
    })

    expect(conf.capacitor.capacitorCliPreparationParams).toEqual([
      'sync',
      'android'
    ])
    expect(conf.capacitor.iosBuildScheme).toBe('App')
  })

  test('devServer.host: true is normalized to 0.0.0.0', async () => {
    const conf = await readConf({ mode: 'spa', dev: true }, { host: true })

    expect(conf.devServer.host).toBe('0.0.0.0')
    // and the all-addresses host resolves to a browsable URL
    expect(conf.metaConf.APP_URL).toBe('http://localhost:9100/')
  })

  test('spa prod: publicPath root + distDir + debugging off', async () => {
    const conf = await readConf({ mode: 'spa', prod: true })

    expect(conf.build.publicPath).toBe('/')
    expect(conf.build.vueRouterBase).toBe('/')
    expect(conf.build.distDir).toBe(join(playgroundDir, 'dist/spa'))
    expect(conf.metaConf.debugging).toBe(false)
    expect(conf.build.define['import.meta.env.QUASAR_PROD']).toBe('true')
  })

  test('electron dev: no-trailing-slash APP_URL, https off, empty publicPath', async () => {
    const conf = await readConf({ mode: 'electron', dev: true })

    // empty publicPath ⇒ the App URL has NO trailing slash — relied
    // upon by the e2e dev-server readiness detection
    expect(conf.build.publicPath).toBe('')
    expect(conf.metaConf.APP_URL).toBe('http://localhost:9100')

    expect(conf.devServer.https).toBe(false)
    expect(conf.devServer.open).toBeUndefined()

    // from the playground's quasar.config
    expect(conf.electron.inspectPort).toBe(playgroundConfig.electronInspectPort)
    expect(conf.electron.preloadScripts).toEqual(
      playgroundConfig.electronPreloadScripts
    )
    // gets resolved to an absolute path for electron mode
    expect(conf.sourceFiles.electronMain).toBe(
      join(playgroundDir, 'src-electron/electron-main')
    )
  })

  test('ssr prod: middlewares default + prodPort + app-mount hook', async () => {
    const conf = await readConf({ mode: 'ssr', prod: true })

    expect(conf.ssr.prodPort).toBe(playgroundConfig.ssrProdPort)
    expect(conf.ssr.middlewares).toEqual([
      { path: '@/../src-ssr/middlewares/render' }
    ])
    expect(conf.metaConf.needsAppMountHook).toBe(true)
    expect(conf.build.distDir).toBe(join(playgroundDir, 'dist/ssr'))
  })

  test('ssg prod: inherits the ssr/ssg surface with its own distDir', async () => {
    const conf = await readConf({ mode: 'ssg', prod: true })

    expect(conf.build.distDir).toBe(join(playgroundDir, 'dist/ssg'))
    expect(conf.build.publicPath).toBe('/')
  })

  test('pwa prod: sw defaults and their define', async () => {
    const conf = await readConf({ mode: 'pwa', prod: true })

    expect(conf.pwa.workboxMode).toBe(playgroundConfig.pwaWorkboxMode)
    expect(conf.pwa.swFilename).toBe('sw.js')
    expect(
      conf.build.define['import.meta.env.QUASAR_SERVICE_WORKER_FILE']
    ).toBe('"/sw.js"')
    expect(conf.sourceFiles.pwaManifestFile).toBe('src-pwa/manifest.json')
  })

  test('bex: per-target dist folders, dev flavor suffixed', async () => {
    // the target is part of the ctx (the CLI defaults it to chrome)
    const prodConf = await readConf({
      mode: 'bex',
      target: 'chrome',
      prod: true
    })
    expect(prodConf.build.distDir).toBe(join(playgroundDir, 'dist/bex-chrome'))
    expect(prodConf.build.publicPath).toBe('')
    expect(prodConf.metaConf.APP_URL).toBe('index.html')

    const devConf = await readConf({
      mode: 'bex',
      target: 'firefox',
      dev: true
    })
    expect(devConf.build.distDir).toBe(
      join(playgroundDir, 'dist/bex-firefox--dev')
    )
    // survives quasar.config changes/server restarts within a session
    expect(devConf.metaConf.bexWsToken).toBeTypeOf('string')
  })

  test('verifyAddress shifts a busy devServer port to the closest open one', async () => {
    const blocker = createServer()
    await new Promise(resolve => {
      blocker.listen(9100, 'localhost', resolve)
    })

    try {
      const ctx = getCtx({ mode: 'spa', dev: true })
      const configFile = new QuasarConfigFile({
        ctx,
        port: 9100,
        host: 'localhost',
        verifyAddress: true
      })
      const conf = await configFile.read()

      expect(conf.devServer.port).not.toBe(9100)
      expect(conf.devServer.port).toBeGreaterThan(9100)
    } finally {
      await new Promise(resolve => {
        blocker.close(resolve)
      })
    }
  })
})
