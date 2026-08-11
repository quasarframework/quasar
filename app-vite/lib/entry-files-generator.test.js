import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
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

  test('renders the SSG prod entries', () => {
    const entryDir = generateFor({ modeName: 'ssg', dev: false })

    expect(readdirSync(entryDir).sort()).toEqual(
      [...baseFiles, 'server-entry.js', 'ssg-script.js', 'ssr-nonce.js'].sort()
    )
  })
})
