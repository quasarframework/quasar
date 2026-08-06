import { execFile } from 'node:child_process'
import {
  existsSync,
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

// minimal app with the fixture extension package installed
// (but not yet invoked)
const appDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-cmd-ext-')))

writeFileSync(
  join(appDir, 'quasar.config.js'),
  'export default function () {\n  return {}\n}\n'
)
writeFileSync(
  join(appDir, 'package.json'),
  '{ "name": "cmd-ext-app", "version": "0.0.1", "private": true, "type": "module" }\n'
)
writeFileSync(
  join(appDir, 'index.html'),
  '<html><body><!-- quasar:entry-point --></body></html>\n'
)
mkdirSync(join(appDir, 'src'))
mkdirSync(join(appDir, 'node_modules'))
symlinkSync(
  fixtureExtDir,
  join(appDir, 'node_modules/quasar-app-extension-qe2e')
)

afterAll(() => {
  rmSync(appDir, { recursive: true, force: true })
})

const extensionsFile = join(appDir, 'quasar.extensions.json')

// the steps build on each other (list empty → invoke → list → uninvoke)
describe.sequential('[ext.js]', () => {
  test('bare "quasar ext" reports no installed extensions', async () => {
    const { code, output } = await runQuasar(['ext'], appDir)

    expect(code, output).toBe(0)
    expect(output).toContain('No App Extensions are installed')
  })

  test('"ext invoke" registers an already-installed extension', async () => {
    const { code, output } = await runQuasar(['ext', 'invoke', 'qe2e'], appDir)

    expect(code, output).toBe(0)
    expect(existsSync(extensionsFile), output).toBe(true)
    expect(JSON.parse(readFileSync(extensionsFile, 'utf8'))).toHaveProperty(
      'qe2e'
    )
  })

  test('bare "quasar ext" now lists the extension', async () => {
    const { code, output } = await runQuasar(['ext'], appDir)

    expect(code, output).toBe(0)
    expect(output).toContain('Installed App Extensions:')
    expect(output).toContain('qe2e')
  })

  test('"ext uninvoke" deregisters it', async () => {
    const { code, output } = await runQuasar(
      ['ext', 'uninvoke', 'qe2e'],
      appDir
    )

    expect(code, output).toBe(0)
    expect(JSON.parse(readFileSync(extensionsFile, 'utf8'))).not.toHaveProperty(
      'qe2e'
    )
  })

  test('unknown action exits 1', async () => {
    const { code, output } = await runQuasar(['ext', 'foo', 'qe2e'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain('Unknown action specified (foo).')
  })

  test('wrong number of parameters exits 1', async () => {
    const { code, output } = await runQuasar(['ext', 'invoke'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain('Wrong number of parameters (1).')
  })
})
