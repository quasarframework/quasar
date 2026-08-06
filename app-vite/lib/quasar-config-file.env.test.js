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

import { QuasarConfigFile } from './quasar-config-file.js'
import { getCtx } from './utils/get-ctx.js'

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

// a minimal app fixture with its own .env files
function makeApp({ envContent } = {}) {
  const appDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-conf-env-')))
  appDirs.push(appDir)

  writeFileSync(
    join(appDir, 'quasar.config.js'),
    'export default function () {\n  return {}\n}\n'
  )
  writeFileSync(
    join(appDir, 'package.json'),
    '{ "name": "conf-env-app", "version": "0.0.1", "private": true, "type": "module" }\n'
  )
  writeFileSync(
    join(appDir, 'index.html'),
    '<html><body><!-- quasar:entry-point --></body></html>\n'
  )
  mkdirSync(join(appDir, 'src'))

  if (envContent !== void 0) {
    writeFileSync(join(appDir, '.env'), envContent)
  }

  mkdirSync(join(appDir, 'node_modules/@quasar'), { recursive: true })
  symlinkSync(
    realpathSync(join(playgroundDir, 'node_modules/quasar')),
    join(appDir, 'node_modules/quasar')
  )
  symlinkSync(cliDir, join(appDir, 'node_modules/@quasar/app-vite'))

  return appDir
}

function makeConfigFile(appDir, opts = {}) {
  process.chdir(appDir)
  const ctx = getCtx({ mode: 'spa', dev: true })
  return new QuasarConfigFile({
    ctx,
    port: 9000,
    host: 'localhost',
    ...opts
  })
}

describe('[quasar-config-file.js] app env injection', () => {
  test('injects prefixed .env values into the client define list', async () => {
    const appDir = makeApp({
      envContent: 'QCLI_PROBE=injected-value\nUNPREFIXED=hidden\n'
    })

    const conf = await makeConfigFile(appDir).read()

    expect(conf.metaConf.clientEnvDefineList).toMatchObject({
      'import.meta.env.QCLI_PROBE': '"injected-value"'
    })
    // non-prefixed variables must not leak into client code
    expect(JSON.stringify(conf.metaConf.clientEnvDefineList)).not.toContain(
      'hidden'
    )
  })

  test('without env files the define list stays empty', async () => {
    const appDir = makeApp()

    const conf = await makeConfigFile(appDir).read()

    expect(conf.metaConf.clientEnvDefineList).toEqual({})
  })
})

describe('[quasar-config-file.js] watch mode', () => {
  test('an .env change triggers onUpdate with the fresh env', async () => {
    const appDir = makeApp({ envContent: 'QCLI_PROBE=initial\n' })

    const configFile = makeConfigFile(appDir, { watch: true })
    const conf = await configFile.read()
    expect(conf.metaConf.clientEnvDefineList).toMatchObject({
      'import.meta.env.QCLI_PROBE': '"initial"'
    })

    const { promise, resolve } = Promise.withResolvers()
    configFile.watch(resolve)

    // chokidar needs a beat to arm before the change happens
    await new Promise(resolveSleep => {
      setTimeout(resolveSleep, 300)
    })
    writeFileSync(join(appDir, '.env'), 'QCLI_PROBE=updated\n')

    const updatedConf = await promise
    expect(updatedConf.metaConf.clientEnvDefineList).toMatchObject({
      'import.meta.env.QCLI_PROBE': '"updated"'
    })
  }, 30_000)
})
