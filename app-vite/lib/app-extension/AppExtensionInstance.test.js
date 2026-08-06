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
import { dirname, join } from 'node:path'
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest'

import { getCtx } from '../utils/get-ctx.js'
import { getAppExtJson } from './create-app-ext.js'
import { AppExtensionInstance } from './AppExtensionInstance.js'

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
    mkdtempSync(join(tmpdir(), 'app-vite-ae-instance-'))
  )
  appDirs.push(appDir)

  writeFileSync(
    join(appDir, 'quasar.config.js'),
    'export default function () {\n  return {}\n}\n'
  )
  writeFileSync(
    join(appDir, 'package.json'),
    '{ "name": "ae-instance-app", "version": "0.0.1", "private": true, "type": "module" }\n'
  )
  writeFileSync(
    join(appDir, 'index.html'),
    '<html><body><!-- quasar:entry-point --></body></html>\n'
  )
  mkdirSync(join(appDir, 'src'))
  mkdirSync(join(appDir, 'node_modules'))

  return appDir
}

// writes a quasar-app-extension-qtest package into the app's
// node_modules with the given script/asset files
function makeExtensionPackage(appDir, files = {}) {
  const pkgDir = join(appDir, 'node_modules/quasar-app-extension-qtest')
  mkdirSync(pkgDir, { recursive: true })
  writeFileSync(
    join(pkgDir, 'package.json'),
    '{ "name": "quasar-app-extension-qtest", "version": "0.0.1", "type": "module" }\n'
  )

  for (const [relPath, content] of Object.entries(files)) {
    const filePath = join(pkgDir, relPath)
    mkdirSync(dirname(filePath), { recursive: true })
    writeFileSync(filePath, content)
  }

  return pkgDir
}

// getCtx() resolves the app from process.cwd()
function makeInstance({ extName = 'qtest', json = {}, files } = {}) {
  const appDir = makeApp()
  process.chdir(appDir)

  if (files !== void 0) {
    makeExtensionPackage(appDir, files)
  }

  const ctx = getCtx({ mode: 'spa', prod: true })
  const extensionsFile = join(appDir, 'quasar.extensions.json')
  const appExtJson = getAppExtJson({
    file: extensionsFile,
    json,
    onListUpdate: () => {}
  })
  const instance = new AppExtensionInstance({ extName, ctx, appExtJson })

  return { instance, appDir, appExtJson, ctx, extensionsFile }
}

// a minimal index script registering a command named after its origin,
// so tests can tell WHICH script file got resolved and executed
const indexRegistering = name =>
  `export default function (api) {\n  api.registerCommand('${name}', () => {})\n}\n`

describe('[AppExtensionInstance.js] extension name parsing', () => {
  // constructor-only concern; ctx/appExtJson are never touched
  const parse = extName =>
    new AppExtensionInstance({ extName, ctx: {}, appExtJson: {} })

  test('bare names get the package prefix', () => {
    const instance = parse('qtest')

    expect(instance.extId).toBe('qtest')
    expect(instance.packageFullName).toBe('quasar-app-extension-qtest')
    expect(instance.packageName).toBe('quasar-app-extension-qtest')
  })

  test('version suffixes stay in packageFullName only', () => {
    const instance = parse('qtest@1.2.3')

    expect(instance.extId).toBe('qtest')
    expect(instance.packageFullName).toBe('quasar-app-extension-qtest@1.2.3')
    expect(instance.packageName).toBe('quasar-app-extension-qtest')
  })

  test('scoped names keep the scope on all derived names', () => {
    const instance = parse('@org/qtest')

    expect(instance.extId).toBe('@org/qtest')
    expect(instance.packageFullName).toBe('@org/quasar-app-extension-qtest')
    expect(instance.packageName).toBe('@org/quasar-app-extension-qtest')
  })

  test('scoped names with version suffixes strip it from ids', () => {
    const instance = parse('@org/qtest@1.2.3')

    expect(instance.extId).toBe('@org/qtest')
    expect(instance.packageFullName).toBe(
      '@org/quasar-app-extension-qtest@1.2.3'
    )
    expect(instance.packageName).toBe('@org/quasar-app-extension-qtest')
  })

  test('a scope without a name is fatal', () => {
    spyExit()
    expect(() => parse('@org')).toThrow('process.exit called')
  })
})

describe('[AppExtensionInstance.js] package detection', () => {
  test('isInstalled reflects the package presence', () => {
    const { instance } = makeInstance({
      files: { 'src/index.js': indexRegistering('installed') }
    })
    expect(instance.isInstalled).toBe(true)

    const { instance: missing } = makeInstance()
    expect(missing.isInstalled).toBe(false)
  })

  test('getPrompts() returns the stored answers without __internal', () => {
    const { instance } = makeInstance({
      json: { qtest: { answer: 1, __internal: { secret: true } } }
    })

    expect(instance.getPrompts()).toEqual({ answer: 1 })
  })
})

describe('[AppExtensionInstance.js] index script resolution', () => {
  test('prefers dist over src', async () => {
    const { instance } = makeInstance({
      files: {
        'dist/index.js': indexRegistering('from-dist-js'),
        'src/index.js': indexRegistering('from-src-js')
      }
    })

    const hooks = await instance.run()
    expect(Object.keys(hooks.commands)).toEqual(['from-dist-js'])
  })

  test.each([
    ['src/index.mjs', 'from-src-mjs', indexRegistering('from-src-mjs')],
    [
      'src/index.cjs',
      'from-src-cjs',
      "module.exports = function (api) {\n  api.registerCommand('from-src-cjs', () => {})\n}\n"
    ],
    [
      'src/index.ts',
      'from-src-ts',
      "export default function (api: { registerCommand: (name: string, fn: () => void) => void }) {\n  api.registerCommand('from-src-ts', () => {})\n}\n"
    ]
  ])('resolves and runs %s', async (relPath, commandName, content) => {
    const { instance } = makeInstance({ files: { [relPath]: content } })

    const hooks = await instance.run()
    expect(Object.keys(hooks.commands)).toEqual([commandName])
  })

  test('a package without an index script is fatal', async () => {
    const { instance } = makeInstance({ files: {} })
    spyExit()

    await expect(instance.run()).rejects.toThrow('process.exit called')
  })

  test('an index script without a function export is fatal', async () => {
    const { instance } = makeInstance({
      files: { 'src/index.js': 'export default 42\n' }
    })
    spyExit()

    await expect(instance.run()).rejects.toThrow('process.exit called')
  })

  test('running a non-installed extension exits', async () => {
    const { instance } = makeInstance()
    spyExit()

    await expect(instance.run()).rejects.toThrow('process.exit called')
  })
})

describe('[AppExtensionInstance.js] install flow', () => {
  test('invoking without the npm package installed is fatal', async () => {
    const { instance } = makeInstance()
    spyExit()

    await expect(instance.install(true)).rejects.toThrow('process.exit called')
  })

  test('stores the prompts script answers in quasar.extensions.json', async () => {
    const { instance, extensionsFile } = makeInstance({
      files: {
        'src/prompts.js':
          'export default function (api) {\n' +
          "  return { greeting: 'hello ' + api.extId }\n" +
          '}\n'
      }
    })

    await instance.install(true)

    expect(JSON.parse(readFileSync(extensionsFile, 'utf8'))).toEqual({
      qtest: { greeting: 'hello qtest' }
    })
  })

  test('a prompts script returning undefined stores empty answers', async () => {
    const { instance, extensionsFile } = makeInstance({
      files: { 'src/prompts.js': 'export default function () {}\n' }
    })

    await instance.install(true)

    expect(JSON.parse(readFileSync(extensionsFile, 'utf8'))).toEqual({
      qtest: {}
    })
  })

  test('a prompts script returning a non-plain object is fatal', async () => {
    const { instance } = makeInstance({
      files: { 'src/prompts.js': 'export default function () { return [] }\n' }
    })
    spyExit()

    await expect(instance.install(true)).rejects.toThrow('process.exit called')
  })

  test('runs the install script: renders templates and prints exit logs', async () => {
    const binaryContent = Buffer.from([0x00, 0x01, 0xfe, 0xff])
    const { instance, appDir } = makeInstance({
      files: {
        'src/prompts.js':
          "export default function () { return { greeting: 'devland' } }\n",
        'src/install.js':
          'export default function (api) {\n' +
          "  api.render('./templates', { greeting: api.prompts.greeting })\n" +
          "  api.renderFile('./single.txt', 'rendered-single.txt', { greeting: api.prompts.greeting })\n" +
          "  api.onExitLog('install exit log line')\n" +
          '}\n',
        'src/templates/rendered/greeting.txt': 'greeting=<%= greeting %>\n',
        'src/templates/rendered/_dotfile.txt': 'dot\n',
        'src/templates/rendered/__underscore.txt': 'underscore\n',
        'src/templates/rendered/raw.bin': binaryContent,
        'src/single.txt': 'single=<%= greeting %>\n'
      }
    })

    await instance.install(true)

    const renderedDir = join(appDir, 'rendered')
    // template interpolation with the prompts-derived scope
    // (the template renderer drops the trailing newline)
    expect(readFileSync(join(renderedDir, 'greeting.txt'), 'utf8')).toBe(
      'greeting=devland'
    )
    // "_name" renders as dotfile, "__name" drops one underscore
    expect(existsSync(join(renderedDir, '.dotfile.txt'))).toBe(true)
    expect(existsSync(join(renderedDir, '_underscore.txt'))).toBe(true)
    expect(existsSync(join(renderedDir, '_dotfile.txt'))).toBe(false)
    // binary files are copied verbatim, never interpolated
    expect(readFileSync(join(renderedDir, 'raw.bin'))).toEqual(binaryContent)
    // renderFile() renders a single file to an app-relative target
    expect(readFileSync(join(appDir, 'rendered-single.txt'), 'utf8')).toBe(
      'single=devland'
    )
    expect(console.log).toHaveBeenCalledWith('install exit log line')
  })

  test('a throwing install script rolls back a fresh registration', async () => {
    const { instance, appExtJson } = makeInstance({
      files: {
        'src/install.js':
          "export default function () { throw new Error('boom') }\n"
      }
    })

    await expect(instance.install(true)).rejects.toThrow('boom')
    expect(appExtJson.has('qtest')).toBe(false)
  })

  test('a throwing install script restores the previous registration', async () => {
    const { instance, extensionsFile } = makeInstance({
      json: { qtest: { previous: true } },
      files: {
        'src/install.js':
          "export default function () { throw new Error('boom') }\n"
      }
    })

    await expect(instance.install(true)).rejects.toThrow('boom')
    expect(JSON.parse(readFileSync(extensionsFile, 'utf8'))).toEqual({
      qtest: { previous: true }
    })
  })
})

describe('[AppExtensionInstance.js] uninstall flow', () => {
  test('runs the uninstall script and deregisters the extension', async () => {
    const { instance, appDir, appExtJson } = makeInstance({
      json: { qtest: { answer: 1 } },
      files: {
        'src/uninstall.js':
          'export default function (api) {\n' +
          "  api.removePath('installed-by-ext')\n" +
          "  api.onExitLog('uninstall exit log line')\n" +
          '}\n'
      }
    })
    mkdirSync(join(appDir, 'installed-by-ext'))

    await instance.uninstall(true)

    expect(existsSync(join(appDir, 'installed-by-ext'))).toBe(false)
    expect(appExtJson.has('qtest')).toBe(false)
    expect(console.log).toHaveBeenCalledWith('uninstall exit log line')
  })

  test('uninvoking without the npm package installed is fatal', async () => {
    const { instance } = makeInstance({ json: { qtest: {} } })
    spyExit()

    await expect(instance.uninstall(true)).rejects.toThrow(
      'process.exit called'
    )
  })

  test('uninstalling a non-installed extension warns and returns', async () => {
    const { instance, appExtJson } = makeInstance({ json: { qtest: {} } })

    await instance.uninstall(false)

    // nothing blew up and the registration was left alone
    expect(appExtJson.has('qtest')).toBe(true)
    expect(console.warn).toHaveBeenCalled()
  })
})
