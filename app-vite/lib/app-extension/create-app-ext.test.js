import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, describe, expect, test } from 'vitest'

import { QuasarConfigFile } from '../quasar-config-file.js'
import { getCtx } from '../utils/get-ctx.js'

const playgroundDir = join(import.meta.dirname, '../../playground-js')
const fixtureExtDir = join(
  import.meta.dirname,
  '../../test/fixtures/quasar-app-extension-qe2e'
)
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

    expect(conf.htmlVariables.qe2eMarker).toBe('qe2e-extension-active')
  })

  test('without registration the extension has no effect', async () => {
    const conf = await readConf(makeApp({ withExtension: false }))

    expect(conf.htmlVariables.qe2eMarker).toBeUndefined()
  })
})
