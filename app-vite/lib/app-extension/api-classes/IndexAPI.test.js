import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
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
import { IndexAPI } from './IndexAPI.js'

const originalCwd = process.cwd()

const appDirs = []
beforeEach(() => {
  // silence the CLI output (individual tests inspect the spies)
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
  const appDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-ae-index-')))
  appDirs.push(appDir)

  writeFileSync(
    join(appDir, 'quasar.config.js'),
    'export default function () {\n  return {}\n}\n'
  )
  writeFileSync(
    join(appDir, 'package.json'),
    '{ "name": "ae-index-app", "version": "0.0.1", "private": true, "type": "module" }\n'
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
  const extensionsFile = join(appDir, 'quasar.extensions.json')
  const appExtJson = getAppExtJson({
    file: extensionsFile,
    json,
    onListUpdate: () => {}
  })
  const packageDir = join(appDir, 'node_modules/quasar-app-extension-qtest')
  const api = new IndexAPI(
    { ctx, extId: 'qtest', prompts, packageDir },
    appExtJson
  )

  return { api, appDir, appExtJson, ctx, extensionsFile, packageDir }
}

describe('[IndexAPI.js] prompts answers', () => {
  test('are exposed on the api object', () => {
    const prompts = { featureX: true }
    const { api } = makeApi({ prompts })

    expect(api.prompts).toBe(prompts)
  })
})

describe('[IndexAPI.js] persistent config', () => {
  test('getPersistentConf() returns an empty object when never set', () => {
    const { api } = makeApi()
    expect(api.getPersistentConf()).toEqual({})
  })

  test('setPersistentConf() persists into quasar.extensions.json', () => {
    const { api, appExtJson, extensionsFile } = makeApi()

    api.setPersistentConf({ some: 'value' })

    expect(api.getPersistentConf()).toEqual({ some: 'value' })
    expect(JSON.parse(readFileSync(extensionsFile, 'utf8'))).toEqual({
      qtest: { __internal: { some: 'value' } }
    })
    // the internal config does not leak into the prompts answers
    expect(appExtJson.getPrompts('qtest')).toEqual({})
  })

  test('setPersistentConf() with no value resets to an empty object', () => {
    const { api } = makeApi()

    api.setPersistentConf({ some: 'value' })
    api.setPersistentConf()

    expect(api.getPersistentConf()).toEqual({})
  })

  test('mergePersistentConf() deep merges into the existing config', () => {
    const { api } = makeApi()

    api.setPersistentConf({ nested: { kept: 1 }, plain: 'yes' })
    api.mergePersistentConf({ nested: { added: 2 } })

    expect(api.getPersistentConf()).toEqual({
      nested: { kept: 1, added: 2 },
      plain: 'yes'
    })
  })
})

describe('[IndexAPI.js] host package inspection', () => {
  test('compatibleWith() passes silently when the condition is met', () => {
    const { api, appDir } = makeApi()
    addHostPackage(appDir, 'some-pkg', '2.3.0')

    expect(() => api.compatibleWith('some-pkg', '^2.0.0')).not.toThrow()
  })

  test('compatibleWith() halts when the package is missing', () => {
    const { api } = makeApi()
    const exitSpy = spyExit()

    expect(() => api.compatibleWith('missing-pkg', '^2.0.0')).toThrow(
      'process.exit called'
    )
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  test('compatibleWith() halts when the version does not satisfy', () => {
    const { api, appDir } = makeApi()
    addHostPackage(appDir, 'some-pkg', '1.0.0')
    spyExit()

    expect(() => api.compatibleWith('some-pkg', '^2.0.0')).toThrow(
      'process.exit called'
    )
  })

  test('hasPackage() checks presence and optional semver condition', () => {
    const { api, appDir } = makeApi()
    addHostPackage(appDir, 'some-pkg', '2.3.0')

    expect(api.hasPackage('some-pkg')).toBe(true)
    expect(api.hasPackage('some-pkg', '^2.0.0')).toBe(true)
    expect(api.hasPackage('some-pkg', '^3.0.0')).toBe(false)
    expect(api.hasPackage('missing-pkg')).toBe(false)
  })

  test('getPackageVersion() returns the version or undefined', () => {
    const { api, appDir } = makeApi()
    addHostPackage(appDir, 'some-pkg', '2.3.0')

    expect(api.getPackageVersion('some-pkg')).toBe('2.3.0')
    expect(api.getPackageVersion('missing-pkg')).toBeUndefined()
  })

  test('hasExtension() checks the registered extensions list', () => {
    const { api } = makeApi({ json: { 'other-ext': {} } })

    expect(api.hasExtension('other-ext')).toBe(true)
    expect(api.hasExtension('unknown-ext')).toBe(false)
  })
})

describe('[IndexAPI.js] hooks', () => {
  const hookMethods = [
    'extendQuasarConf',

    'extendViteConf',
    'extendSSRWebserverConf',
    'extendSSRPackageJson',
    'extendSSRManifestJson',
    'extendSSRGenerateSWOptions',
    'extendSSRInjectManifestOptions',
    'extendSSGRendererConf',
    'extendSSGManifestJson',
    'extendSSGGenerateSWOptions',
    'extendSSGInjectManifestOptions',
    'extendElectronMainConf',
    'extendElectronPreloadConf',
    'extendElectronPackageJson',
    'extendPWACustomSWConf',
    'extendPWAManifestJson',
    'extendPWAGenerateSWOptions',
    'extendPWAInjectManifestOptions',
    'extendBexScriptsConf',
    'extendBexManifestJson',

    'beforeDev',
    'afterDev',
    'beforeBuild',
    'afterBuild',
    'onPublish'
  ]

  test('every hook method registers its callback with api + packageDir', () => {
    const { api, appExtJson, packageDir } = makeApi()

    for (const method of hookMethods) {
      expect(api[method], method).toBeTypeOf('function')
      api[method](`${method}-callback`)
    }

    const hooks = api.__getHooks(appExtJson)

    for (const method of hookMethods) {
      expect(hooks[method], method).toEqual([
        { fn: `${method}-callback`, api, packageDir }
      ])
    }
  })

  test('hook lists start out empty', () => {
    const { api, appExtJson } = makeApi()
    const hooks = api.__getHooks(appExtJson)

    for (const method of hookMethods) {
      expect(hooks[method], method).toEqual([])
    }
    expect(hooks.commands).toEqual({})
    expect(hooks.describeApi).toEqual({})
  })

  test('registerCommand() stores the command handler', () => {
    const { api, appExtJson } = makeApi()
    const handler = () => {}

    api.registerCommand('greet', handler)

    expect(api.__getHooks(appExtJson).commands.greet).toBe(handler)
  })

  test('registerDescribeApi() records the registering script folder', async () => {
    const { api, appExtJson, appDir } = makeApi()

    // the caller dir must be the one of the (devland) file invoking the
    // api method, so call from a script outside of this test file
    const scriptDir = join(appDir, 'ae-package')
    mkdirSync(scriptDir)
    const scriptFile = join(scriptDir, 'index.mjs')
    writeFileSync(
      scriptFile,
      'export default function (api) {\n' +
        "  api.registerDescribeApi('QTestThing', './api/qtest-thing.json')\n" +
        '}\n'
    )

    const { default: run } = await import(pathToFileURL(scriptFile).href)
    run(api)

    expect(api.__getHooks(appExtJson).describeApi.QTestThing).toEqual({
      callerPath: scriptDir,
      relativePath: './api/qtest-thing.json'
    })
  })

  test('__getHooks() rejects foreign access tokens', () => {
    const { api } = makeApi()

    expect(api.__getHooks({})).toBeUndefined()
    expect(api.__getHooks()).toBeUndefined()
  })
})
