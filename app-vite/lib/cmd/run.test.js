import { execFile } from 'node:child_process'
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
import { fileURLToPath } from 'node:url'
import { afterAll, describe, expect, test } from 'vitest'

const binFile = fileURLToPath(new URL('../../bin/quasar.js', import.meta.url))
const fixtureExtDir = fileURLToPath(
  new URL('../../test/fixtures/quasar-app-extension-qe2e', import.meta.url)
)

function runQuasar(args, cwd) {
  return new Promise(resolve => {
    const env = { ...process.env, FORCE_COLOR: '0' }
    delete env.NODE_PATH

    execFile(
      process.execPath,
      [binFile, ...args],
      { cwd, env, maxBuffer: 10 * 1024 * 1024 },
      (err, stdout, stderr) => {
        resolve({ code: err === null ? 0 : err.code, output: stdout + stderr })
      }
    )
  })
}

// minimal app with the fixture extension installed AND registered
const appDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-cmd-run-')))

writeFileSync(
  join(appDir, 'quasar.config.js'),
  'export default function () {\n  return {}\n}\n'
)
writeFileSync(
  join(appDir, 'package.json'),
  '{ "name": "cmd-run-app", "version": "0.0.1", "private": true, "type": "module" }\n'
)
writeFileSync(
  join(appDir, 'index.html'),
  '<html><body><!-- quasar:entry-point --></body></html>\n'
)
writeFileSync(join(appDir, 'quasar.extensions.json'), '{ "qe2e": {} }\n')
mkdirSync(join(appDir, 'src'))
mkdirSync(join(appDir, 'node_modules'))
symlinkSync(
  fixtureExtDir,
  join(appDir, 'node_modules/quasar-app-extension-qe2e')
)

afterAll(() => {
  rmSync(appDir, { recursive: true, force: true })
})

describe('[run.js]', () => {
  test('bare "quasar run" shows the help', async () => {
    const { code, output } = await runQuasar(['run'], appDir)

    expect(code, output).toBe(0)
    expect(output).toContain('Run app extension provided commands')
  })

  test('running a non-installed extension exits 1', async () => {
    const { code, output } = await runQuasar(['run', 'missing', 'x'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain('No such App Extension is installed')
  })

  test('without a command it lists the available ones', async () => {
    const { code, output } = await runQuasar(['run', 'qe2e'], appDir)

    expect(code, output).toBe(0)
    expect(output).toContain('Command list: greet')
  })

  test('runs a registered command', async () => {
    const { code, output } = await runQuasar(['run', 'qe2e', 'greet'], appDir)

    expect(code, output).toBe(0)
    expect(output).toContain('Running App Extension command "greet"')
    expect(output).toContain('qe2e greet command executed')
  })

  test('an unknown command exits 1 and lists the valid ones', async () => {
    const { code, output } = await runQuasar(['run', 'qe2e', 'bogus'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain('Command list: greet')
    expect(output).toContain('no command called "bogus"')
  })
})
