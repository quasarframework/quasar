import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, describe, expect, test } from 'vitest'

import { EntryFilesGenerator } from './entry-files-generator.js'

// the CLI dir hosting /templates/entry
const cliDir = join(import.meta.dirname, '..')

const baseFiles = [
  'app.js',
  'client-entry.js',
  'client-prefetch.js',
  'quasar-user-options.js'
]

const tempDirs = []

function makeEntryDir() {
  const dir = mkdtempSync(join(tmpdir(), 'q-entry-files-'))
  tempDirs.push(dir)
  return dir
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true })
  }
})

function makeCtx({ modeName = 'spa', dev = false, entryDir }) {
  const mode = {
    spa: false,
    ssr: false,
    ssg: false,
    pwa: false,
    capacitor: false,
    cordova: false,
    electron: false,
    bex: false,
    [modeName]: true
  }

  return {
    dev,
    prod: !dev,
    modeName,
    mode,
    appPaths: {
      resolve: {
        cli: dir => join(cliDir, dir),
        entry: dir => join(entryDir, dir)
      }
    }
  }
}

// minimal quasarConf subset the entry templates consume
function makeQuasarConf(ctx) {
  return {
    ctx,
    boot: [],
    css: [],
    extras: [],
    animations: [],
    preFetch: false,
    framework: {
      config: {},
      components: [],
      directives: [],
      plugins: [],
      cssAddon: false,
      lang: false,
      iconSet: false
    },
    build: {
      publicPath: '/',
      vueRouterMode: 'history'
    },
    sourceFiles: {
      rootComponent: 'src/App.vue',
      router: 'src/router/index',
      store: 'src/store/index'
    },
    metaConf: {
      hasStore: false,
      needsAppMountHook: false,
      debugging: false,
      hasLoadingBarPlugin: false,
      css: { quasarSrcExt: 'css' },
      versions: {}
    },
    ssr: {
      middlewares: [],
      manualStoreSerialization: false,
      manualStoreHydration: false,
      manualPostHydrationTrigger: false,
      clientSideRenderingRoutes: [],
      noPreloadTagRoutes: [],
      prodScriptNamedExport: [],
      prodPort: 3000,
      pwa: false
    },
    ssg: {
      manualStoreSerialization: false,
      manualStoreHydration: false,
      manualPostHydrationTrigger: false
    }
  }
}

function generateFor(opts = {}) {
  const entryDir = makeEntryDir()
  const ctx = makeCtx({ ...opts, entryDir })

  const generator = new EntryFilesGenerator(ctx)
  generator.generate(makeQuasarConf(ctx))

  return entryDir
}

function readEntry(entryDir, file) {
  return readFileSync(join(entryDir, file), 'utf8')
}

describe('[entry-files-generator.js]', () => {
  test('renders the base entry files for SPA mode', () => {
    const entryDir = generateFor({ modeName: 'spa' })

    expect(readdirSync(entryDir).sort()).toEqual(baseFiles)

    const appFile = readEntry(entryDir, 'app.js')
    expect(appFile).toContain("import RootComponent from '@/../src/App.vue'")
    expect(appFile).toContain(
      "import createRouter from '@/../src/router/index'"
    )
    expect(appFile).not.toContain('bex-app.js')

    const clientEntry = readEntry(entryDir, 'client-entry.js')
    expect(clientEntry).toContain('const publicPath = `/`')
    expect(clientEntry).toContain("import 'quasar/dist/quasar.css'")

    const userOptions = readEntry(entryDir, 'quasar-user-options.js')
    expect(userOptions).toContain('export default { config: {} }')

    // no unrendered template tags may survive
    for (const file of baseFiles) {
      expect(readEntry(entryDir, file)).not.toContain('<%')
    }
  })

  test('interpolates framework and source file settings', () => {
    const entryDir = makeEntryDir()
    const ctx = makeCtx({ modeName: 'spa', entryDir })
    const quasarConf = makeQuasarConf(ctx)

    quasarConf.framework.components = ['QBtn', 'QIcon']
    quasarConf.framework.plugins = ['Notify']
    quasarConf.sourceFiles.rootComponent = 'src/MyApp.vue'

    const generator = new EntryFilesGenerator(ctx)
    generator.generate(quasarConf)

    const userOptions = readEntry(entryDir, 'quasar-user-options.js')
    expect(userOptions).toContain("import {QBtn,QIcon,Notify} from 'quasar'")
    expect(userOptions).toContain('components: {QBtn,QIcon}')
    expect(userOptions).toContain('plugins: {Notify}')

    const appFile = readEntry(entryDir, 'app.js')
    expect(appFile).toContain("import RootComponent from '@/../src/MyApp.vue'")
  })

  test('copies bex-app.js as-is for BEX mode', () => {
    const entryDir = generateFor({ modeName: 'bex' })

    expect(readdirSync(entryDir).sort()).toEqual(
      [...baseFiles, 'bex-app.js'].sort()
    )

    // regular (non-templated) files are byte-for-byte copies
    expect(readEntry(entryDir, 'bex-app.js')).toBe(
      readFileSync(join(cliDir, 'templates/entry/bex-app.js'), 'utf8')
    )

    expect(readEntry(entryDir, 'app.js')).toContain(
      "import { bex } from './bex-app.js'"
    )
  })

  test('renders the SSR dev entries', () => {
    const entryDir = generateFor({ modeName: 'ssr', dev: true })

    expect(readdirSync(entryDir).sort()).toEqual(
      [
        ...baseFiles,
        'server-entry.js',
        'ssr-middlewares.js',
        'ssr-dev-webserver.js',
        'ssr-nonce.js'
      ].sort()
    )
  })

  test('renders the SSR prod entries', () => {
    const entryDir = generateFor({ modeName: 'ssr', dev: false })

    const files = readdirSync(entryDir)
    expect(files).toContain('ssr-prod-webserver.js')
    expect(files).not.toContain('ssr-dev-webserver.js')
  })

  test('passes publicPath to every addPreFetchHooks() call site', () => {
    for (const modeName of ['spa', 'ssr']) {
      const entryDir = makeEntryDir()
      const ctx = makeCtx({ modeName, dev: modeName === 'ssr', entryDir })
      const quasarConf = makeQuasarConf(ctx)
      quasarConf.preFetch = true

      new EntryFilesGenerator(ctx).generate(quasarConf)

      const callSites = readEntry(entryDir, 'client-entry.js').match(
        /addPreFetchHooks\(\{.*?\}\)/gs
      )

      expect(callSites.length).toBeGreaterThan(0)
      for (const call of callSites) {
        expect(call).toContain('publicPath')
      }
    }
  })

  // #16423 - during a client-side navigation window.location still points to
  // the previous URL, so urlPath must be derived from the target route instead
  describe('client-prefetch urlPath', () => {
    // renders client-prefetch.js for SSR mode (the variant with no imports,
    // so it can run directly under node) and returns the installed guard
    async function setupGuard() {
      const entryDir = makeEntryDir()
      const ctx = makeCtx({ modeName: 'ssr', dev: true, entryDir })
      const quasarConf = makeQuasarConf(ctx)
      quasarConf.preFetch = true

      new EntryFilesGenerator(ctx).generate(quasarConf)

      const { addPreFetchHooks } = await import(
        pathToFileURL(join(entryDir, 'client-prefetch.js')).href
      )

      let guard = null
      const router = {
        beforeResolve: fn => {
          guard = fn
        },
        currentRoute: { value: null }
      }

      addPreFetchHooks({
        router,
        isClientSideRenderedPage: false,
        publicPath: '/'
      })

      return guard
    }

    function makeRoute(fullPath, component) {
      return {
        fullPath,
        path: fullPath,
        matched: [{ path: fullPath, components: { default: component } }]
      }
    }

    test('receives the URL being navigated to and stops redirect loops', async () => {
      const guard = await setupGuard()

      const seenUrlPaths = []
      const authGuard = {
        preFetch({ urlPath, redirect }) {
          seenUrlPaths.push(urlPath)
          if (urlPath !== '/login') {
            redirect({ path: '/login' })
          }
        }
      }

      const homeRoute = makeRoute('/', { preFetch: authGuard.preFetch })
      const loginRoute = makeRoute('/login', { preFetch: authGuard.preFetch })

      // initial navigation to "/" must redirect
      const firstResult = await guard(homeRoute, { matched: [] })
      expect(seenUrlPaths).toEqual(['/'])
      expect(firstResult).toEqual({ path: '/login' })

      // the restarted navigation to "/login" must see the new URL
      // and therefore NOT redirect again
      const secondResult = await guard(loginRoute, homeRoute)
      expect(seenUrlPaths).toEqual(['/', '/login'])
      expect(secondResult).toBeUndefined()
    })

    test('is the router-facing URL (route fullPath, query included)', async () => {
      const guard = await setupGuard()

      const seenUrlPaths = []
      const route = makeRoute('/login?next=%2Faccount', {
        preFetch: ({ urlPath }) => {
          seenUrlPaths.push(urlPath)
        }
      })

      await guard(route, { matched: [] })
      expect(seenUrlPaths).toEqual(['/login?next=%2Faccount'])
    })
  })

  // the boot-file urlPath must be the router-facing URL in every
  // Vue Router mode: no publicPath prefix, no hash-mode "#" wrapper
  describe('boot urlPath codegen', () => {
    function renderClientEntry({ vueRouterMode, publicPath }) {
      const entryDir = makeEntryDir()
      const ctx = makeCtx({ modeName: 'spa', entryDir })
      const quasarConf = makeQuasarConf(ctx)
      quasarConf.boot = [{ path: './my-boot-file.js' }]
      quasarConf.build.vueRouterMode = vueRouterMode
      quasarConf.build.publicPath = publicPath

      new EntryFilesGenerator(ctx).generate(quasarConf)
      return readEntry(entryDir, 'client-entry.js')
    }

    test('hash mode reads the URL from the hash fragment', () => {
      const clientEntry = renderClientEntry({
        vueRouterMode: 'hash',
        publicPath: '/'
      })
      expect(clientEntry).toContain(
        "const urlPath = window.location.hash.slice(1) || '/'"
      )
    })

    test('history mode strips the publicPath', () => {
      const clientEntry = renderClientEntry({
        vueRouterMode: 'history',
        publicPath: '/base/'
      })
      expect(clientEntry).toContain(
        "window.location.href.replace(window.location.origin, '').replace(publicPath, '/')"
      )
    })

    test('history mode with default publicPath needs no stripping', () => {
      const clientEntry = renderClientEntry({
        vueRouterMode: 'history',
        publicPath: '/'
      })
      expect(clientEntry).toContain(
        "const urlPath = window.location.href.replace(window.location.origin, '')\n"
      )
    })
  })

  test('server-entry passes the publicPath-stripped urlPath to hooks', () => {
    const entryDir = makeEntryDir()
    const ctx = makeCtx({ modeName: 'ssr', dev: true, entryDir })
    const quasarConf = makeQuasarConf(ctx)
    quasarConf.preFetch = true
    quasarConf.boot = [{ path: './my-boot-file.js' }]

    new EntryFilesGenerator(ctx).generate(quasarConf)

    const serverEntry = readEntry(entryDir, 'server-entry.js')
    const hookArgs = serverEntry.match(
      /redirect: \w+RedirectFn,\s*urlPath[^,]*,/g
    )

    // both the boot and the preFetch hook call sites
    expect(hookArgs).toHaveLength(2)
    for (const args of hookArgs) {
      expect(args).not.toContain('origUrlPath')
    }
  })

  test('renders the SSG prod entries', () => {
    const entryDir = generateFor({ modeName: 'ssg', dev: false })

    expect(readdirSync(entryDir).sort()).toEqual(
      [...baseFiles, 'server-entry.js', 'ssg-script.js', 'ssr-nonce.js'].sort()
    )
  })
})
