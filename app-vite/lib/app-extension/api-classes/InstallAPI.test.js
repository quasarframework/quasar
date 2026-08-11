import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
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
import { InstallAPI } from './InstallAPI.js'

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
  const appDir = realpathSync(
    mkdtempSync(join(tmpdir(), 'app-vite-ae-install-'))
  )
  appDirs.push(appDir)

  writeFileSync(
    join(appDir, 'quasar.config.js'),
    'export default function () {\n  return {}\n}\n'
  )
  writeFileSync(
    join(appDir, 'package.json'),
    '{ "name": "ae-install-app", "version": "0.0.1", "private": true, "type": "module" }\n'
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
  const api = new InstallAPI({ ctx, extId: 'qtest', prompts }, appExtJson)

  return { api, appDir, appExtJson, ctx }
}

function readAppPkg(appDir) {
  return JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8'))
}

describe('[InstallAPI.js] base surface', () => {
  test('exposes the prompts answers', () => {
    const prompts = { featureX: true }
    const { api } = makeApi({ prompts })

    expect(api.prompts).toBe(prompts)
  })

  test('persistent config set/merge/get round-trips', () => {
    const { api } = makeApi()

    api.setPersistentConf({ nested: { kept: 1 } })
    api.mergePersistentConf({ nested: { added: 2 } })

    expect(api.getPersistentConf()).toEqual({
      nested: { kept: 1, added: 2 }
    })
  })

  test('compatibleWith() passes when met, halts when not', () => {
    const { api, appDir } = makeApi()
    addHostPackage(appDir, 'some-pkg', '2.3.0')

    expect(() => api.compatibleWith('some-pkg', '^2.0.0')).not.toThrow()

    spyExit()
    expect(() => api.compatibleWith('some-pkg', '^3.0.0')).toThrow(
      'process.exit called'
    )
    expect(() => api.compatibleWith('missing-pkg', '^1.0.0')).toThrow(
      'process.exit called'
    )
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

describe('[InstallAPI.js] extendPackageJson()', () => {
  test('merges an object into the app package.json', () => {
    const { api, appDir, appExtJson } = makeApi()

    api.extendPackageJson({ scripts: { fancy: 'echo fancy' } })

    const pkg = readAppPkg(appDir)
    expect(pkg.name).toBe('ae-install-app')
    expect(pkg.scripts).toEqual({ fancy: 'echo fancy' })

    // no dependencies were touched
    expect(api.__getNodeModuleNeedsUpdate(appExtJson)).toBe(false)
  })

  test('flags a node_modules update when dependencies change', () => {
    const { api, appDir, appExtJson } = makeApi()

    api.extendPackageJson({ dependencies: { 'some-pkg': '^1.0.0' } })

    expect(readAppPkg(appDir).dependencies).toEqual({ 'some-pkg': '^1.0.0' })
    expect(api.__getNodeModuleNeedsUpdate(appExtJson)).toBe(true)
  })

  test('ignores empty or missing input', () => {
    const { api, appDir } = makeApi()
    const before = readFileSync(join(appDir, 'package.json'), 'utf8')

    api.extendPackageJson()
    api.extendPackageJson({})

    expect(readFileSync(join(appDir, 'package.json'), 'utf8')).toBe(before)
  })

  test('accepts a path to a JSON file', () => {
    const { api, appDir } = makeApi()
    const extFile = join(appDir, 'pkg-extension.json')
    writeFileSync(extFile, '{ "scripts": { "fancy": "echo fancy" } }\n')

    api.extendPackageJson(extFile)

    expect(readAppPkg(appDir).scripts).toEqual({ fancy: 'echo fancy' })
  })

  test('warns and skips when the JSON file is missing or a folder', () => {
    const { api, appDir } = makeApi()
    const before = readFileSync(join(appDir, 'package.json'), 'utf8')

    api.extendPackageJson(join(appDir, 'nope.json'))
    api.extendPackageJson(join(appDir, 'src'))

    expect(console.warn).toHaveBeenCalledTimes(2)
    expect(readFileSync(join(appDir, 'package.json'), 'utf8')).toBe(before)
  })

  test('halts on a malformed JSON file', () => {
    const { api, appDir } = makeApi()
    const extFile = join(appDir, 'broken.json')
    writeFileSync(extFile, '{ "scripts": \n')
    spyExit()

    expect(() => api.extendPackageJson(extFile)).toThrow('process.exit called')
  })
})

describe('[InstallAPI.js] extendJsonFile()', () => {
  test('creates a missing file with 2-space indentation', () => {
    const { api, appDir } = makeApi()

    api.extendJsonFile('config/settings.json', { hello: { there: true } })

    const raw = readFileSync(join(appDir, 'config/settings.json'), 'utf8')
    expect(JSON.parse(raw)).toEqual({ hello: { there: true } })
    expect(raw).toContain('\n  "hello"')
  })

  test('deep merges into an existing file', () => {
    const { api, appDir } = makeApi()
    const file = join(appDir, 'settings.json')
    writeFileSync(file, '{ "nested": { "kept": 1 }, "plain": "yes" }\n')

    api.extendJsonFile('settings.json', { nested: { added: 2 } })

    expect(JSON.parse(readFileSync(file, 'utf8'))).toEqual({
      nested: { kept: 1, added: 2 },
      plain: 'yes'
    })
  })

  test('ignores empty or missing input', () => {
    const { api, appDir } = makeApi()

    api.extendJsonFile('settings.json')
    api.extendJsonFile('settings.json', {})

    expect(existsSync(join(appDir, 'settings.json'))).toBe(false)
  })

  test('warns and leaves flavoured JSON files untouched', () => {
    const { api, appDir } = makeApi()
    const file = join(appDir, 'tsconfig.json')
    const flavouredContent = '{\n  // flavoured JSON\n  "a": 1\n}\n'
    writeFileSync(file, flavouredContent)

    api.extendJsonFile('tsconfig.json', { b: 2 })

    expect(console.warn).toHaveBeenCalled()
    expect(readFileSync(file, 'utf8')).toBe(flavouredContent)
  })
})

describe('[InstallAPI.js] render hooks', () => {
  test('render() queues a template folder', () => {
    const { api, appDir, appExtJson } = makeApi()
    const templateDir = join(appDir, 'templates')
    mkdirSync(templateDir)

    api.render(templateDir)
    const scope = { name: 'devland' }
    api.render(templateDir, scope)

    expect(api.__getHooks(appExtJson).renderFolders).toEqual([
      { source: templateDir, rawCopy: true, scope: void 0 },
      { source: templateDir, rawCopy: false, scope }
    ])
  })

  test('render() warns and skips missing or non-folder sources', () => {
    const { api, appDir, appExtJson } = makeApi()
    const filePath = join(appDir, 'some-file.txt')
    writeFileSync(filePath, 'hi\n')

    api.render(join(appDir, 'nope'))
    api.render(filePath)

    expect(console.warn).toHaveBeenCalledTimes(2)
    expect(api.__getHooks(appExtJson).renderFolders).toEqual([])
  })

  test('renderFile() queues a single template file', () => {
    const { api, appDir, appExtJson } = makeApi()
    const sourcePath = join(appDir, 'template-file.txt')
    writeFileSync(sourcePath, 'hi\n')

    const scope = { name: 'devland' }
    api.renderFile(sourcePath, 'target/rendered.txt', scope)

    expect(api.__getHooks(appExtJson).renderFiles).toEqual([
      {
        sourcePath,
        targetPath: join(appDir, 'target/rendered.txt'),
        rawCopy: false,
        scope,
        overwritePrompt: true
      }
    ])
  })

  test('renderFile() warns and skips missing or folder sources', () => {
    const { api, appDir, appExtJson } = makeApi()

    api.renderFile(join(appDir, 'nope.txt'), 'target.txt')
    api.renderFile(join(appDir, 'src'), 'target.txt')

    expect(console.warn).toHaveBeenCalledTimes(2)
    expect(api.__getHooks(appExtJson).renderFiles).toEqual([])
  })
})

describe('[InstallAPI.js] exit log & access protection', () => {
  test('onExitLog() collects messages', () => {
    const { api, appExtJson } = makeApi()

    api.onExitLog('first')
    api.onExitLog('second')

    expect(api.__getHooks(appExtJson).exitLog).toEqual(['first', 'second'])
  })

  test('private getters reject foreign access tokens', () => {
    const { api } = makeApi()

    expect(api.__getHooks({})).toBeUndefined()
    expect(api.__getNodeModuleNeedsUpdate({})).toBeUndefined()
  })
})
