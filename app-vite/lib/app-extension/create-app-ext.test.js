import {
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
import { afterAll, afterEach, describe, expect, test, vi } from 'vitest'

import { QuasarConfigFile } from '../quasar-config-file.js'
import { getCtx } from '../utils/get-ctx.js'
import { getApi } from '../utils/get-api.js'
import { getAppExtJson } from './create-app-ext.js'
import qe2eMarkers from '../../test/fixtures/quasar-app-extension-qe2e/src/markers.js'

const playgroundDir = join(import.meta.dirname, '../../playground-js')
const fixtureExtDir = join(
  import.meta.dirname,
  '../../test/fixtures/quasar-app-extension-qe2e'
)
const originalCwd = process.cwd()

const appDirs = []
afterEach(() => {
  vi.restoreAllMocks()
  process.chdir(originalCwd)
})
afterAll(() => {
  for (const dir of appDirs) {
    rmSync(dir, { recursive: true, force: true })
  }
})

function makeApp({ withExtension }) {
  const appDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-app-ext-')))
  appDirs.push(appDir)

  writeFileSync(
    join(appDir, 'quasar.config.js'),
    'export default function () {\n  return {}\n}\n'
  )
  writeFileSync(
    join(appDir, 'package.json'),
    '{ "name": "app-ext-app", "version": "0.0.1", "private": true, "type": "module" }\n'
  )
  writeFileSync(
    join(appDir, 'index.html'),
    '<html><body><!-- quasar:entry-point --></body></html>\n'
  )
  mkdirSync(join(appDir, 'src'))
  mkdirSync(join(appDir, 'node_modules'))
  symlinkSync(
    realpathSync(join(playgroundDir, 'node_modules/quasar')),
    join(appDir, 'node_modules/quasar')
  )

  if (withExtension) {
    writeFileSync(join(appDir, 'quasar.extensions.json'), '{ "qe2e": {} }\n')
    symlinkSync(
      fixtureExtDir,
      join(appDir, 'node_modules/quasar-app-extension-qe2e')
    )
  }

  return appDir
}

function readConf(appDir) {
  process.chdir(appDir)
  const ctx = getCtx({ mode: 'spa', prod: true })
  return new QuasarConfigFile({
    ctx,
    port: 9000,
    host: 'localhost'
  }).read()
}

describe('[create-app-ext.js] extension hooks', () => {
  test('a registered extension extends the quasar config', async () => {
    const conf = await readConf(makeApp({ withExtension: true }))

    expect(conf.htmlVariables.qe2eMarker).toBe(qe2eMarkers.quasarConfMarker)
  })

  test('without registration the extension has no effect', async () => {
    const conf = await readConf(makeApp({ withExtension: false }))

    expect(conf.htmlVariables.qe2eMarker).toBeUndefined()
  })

  test('a registered extension supplies its registered describe API', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})

    const appDir = makeApp({ withExtension: true })
    process.chdir(appDir)
    const ctx = getCtx({ mode: 'spa', prod: true })

    // registered via registerDescribeApi() with a path relative to
    // the fixture's index script
    const result = await getApi(qe2eMarkers.describeApiName, ctx)

    expect(result.supplier).toBe('qe2e')
    // the served API is exactly the fixture's registered JSON file
    expect(result.api).toEqual(
      JSON.parse(
        readFileSync(
          join(fixtureExtDir, 'src/describe-api/qe2e-thing.json'),
          'utf8'
        )
      )
    )
  })
})

describe('[create-app-ext.js] getAppExtJson()', () => {
  function makeExtJson(json = {}) {
    const dir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-ext-json-')))
    appDirs.push(dir)

    const file = join(dir, 'quasar.extensions.json')
    const updates = []

    return {
      file,
      updates,
      acc: getAppExtJson({
        file,
        json,
        onListUpdate: updatedJson => {
          updates.push(structuredClone(updatedJson))
        }
      })
    }
  }

  function readExtFile(file) {
    return JSON.parse(readFileSync(file, 'utf8'))
  }

  test('reports nothing for unknown extensions', () => {
    const { acc } = makeExtJson()

    expect(acc.has('qtest')).toBe(false)
    expect(acc.get('qtest')).toBeUndefined()
    expect(acc.getPrompts('qtest')).toEqual({})
    expect(acc.getInternal('qtest')).toEqual({})
  })

  test('set() persists to the file and notifies only on list changes', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const { acc, file, updates } = makeExtJson()

    acc.set('qtest', { answer: 1 })

    expect(acc.has('qtest')).toBe(true)
    expect(readExtFile(file)).toEqual({ qtest: { answer: 1 } })
    // a freshly created file uses 2-space indentation
    expect(readFileSync(file, 'utf8')).toContain('\n  "qtest"')
    expect(updates).toHaveLength(1)

    // updating an already registered extension does not change the list
    acc.set('qtest', { answer: 2 })
    expect(readExtFile(file)).toEqual({ qtest: { answer: 2 } })
    expect(updates).toHaveLength(1)
  })

  test('get() and getPrompts() return detached clones', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const { acc } = makeExtJson()

    acc.set('qtest', { answer: 1 })

    acc.get('qtest').answer = 99
    acc.getPrompts('qtest').answer = 99

    expect(acc.get('qtest')).toEqual({ answer: 1 })
  })

  test('setInternal() keeps the internal config out of the prompts', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const { acc, file } = makeExtJson()

    acc.set('qtest', { answer: 1 })
    acc.setInternal('qtest', { secret: true })

    expect(acc.getInternal('qtest')).toEqual({ secret: true })
    expect(acc.getPrompts('qtest')).toEqual({ answer: 1 })
    expect(readExtFile(file)).toEqual({
      qtest: { answer: 1, __internal: { secret: true } }
    })
  })

  test('remove() deregisters and notifies; unknown ids are a no-op', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const { acc, file, updates } = makeExtJson()

    acc.set('qtest', { answer: 1 })
    expect(updates).toHaveLength(1)

    acc.remove('qtest')
    expect(acc.has('qtest')).toBe(false)
    expect(readExtFile(file)).toEqual({})
    expect(updates).toHaveLength(2)

    acc.remove('never-registered')
    expect(updates).toHaveLength(2)
  })
})
