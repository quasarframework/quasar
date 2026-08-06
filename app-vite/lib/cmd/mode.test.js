import { execFile } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, describe, expect, test } from 'vitest'

const binFile = fileURLToPath(new URL('../../bin/quasar.js', import.meta.url))
const playgroundDir = fileURLToPath(
  new URL('../../playground-js', import.meta.url)
)

function runQuasar(args, cwd) {
  return new Promise(resolve => {
    const env = { ...process.env, FORCE_COLOR: '0' }
    // vitest sets NODE_PATH to the monorepo pnpm store, which would
    // give the spawned CLI an unrealistic module resolution
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

// minimal Quasar app; "mode remove" re-reads the quasar.config file
// and regenerates types, so it needs a valid index.html too
const appDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-cmd-mode-')))

writeFileSync(
  join(appDir, 'quasar.config.js'),
  'export default function () {\n  return {}\n}\n'
)
writeFileSync(
  join(appDir, 'package.json'),
  '{ "name": "cmd-mode-app", "version": "0.0.1", "private": true, "type": "module" }\n'
)
writeFileSync(
  join(appDir, 'index.html'),
  '<html><body><!-- quasar:entry-point --></body></html>\n'
)
mkdirSync(join(appDir, 'src'))

afterAll(() => {
  rmSync(appDir, { recursive: true, force: true })
})

describe('[mode.js]', () => {
  test('bare "quasar mode" lists all installable modes', async () => {
    const { code, output } = await runQuasar(['mode'], playgroundDir)

    expect(code, output).toBe(0)
    expect(output).toContain('Detecting installed modes...')

    for (const mode of [
      'PWA',
      'SSR',
      'SSG',
      'CORDOVA',
      'CAPACITOR',
      'ELECTRON',
      'BEX'
    ]) {
      expect(output).toContain(`Mode ${mode}`)
    }
  })

  // "mode add <mode>" is intentionally not covered: it runs a real
  // package manager install (network access) through ensureModeDeps()
  test('"mode remove pwa --yes" removes /src-pwa and regenerates types', async () => {
    const srcPwaDir = join(appDir, 'src-pwa')
    mkdirSync(srcPwaDir, { recursive: true })
    writeFileSync(join(srcPwaDir, 'dummy.js'), '')

    const { code, output } = await runQuasar(
      ['mode', 'remove', 'pwa', '--yes'],
      appDir
    )

    expect(code, output).toBe(0)
    expect(output).toContain('PWA support was removed')
    expect(existsSync(srcPwaDir)).toBe(false)
    // types have been re-generated accordingly
    expect(existsSync(join(appDir, '.quasar'))).toBe(true)
  })

  test('"mode remove" of a non-installed mode aborts gracefully', async () => {
    const { code, output } = await runQuasar(
      ['mode', 'remove', 'bex', '--yes'],
      appDir
    )

    expect(code, output).toBe(0)
    expect(output).toContain('No BEX support detected. Aborting.')
  })

  test('wrong number of parameters exits 1', async () => {
    const { code, output } = await runQuasar(['mode', 'add'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain('Wrong number of parameters (1).')
  })

  test('unknown action exits 1', async () => {
    const { code, output } = await runQuasar(['mode', 'foo', 'pwa'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain('Unknown action specified (foo).')
  })

  test('unknown mode exits 1', async () => {
    const { code, output } = await runQuasar(['mode', 'add', 'foo'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain('Unknown mode "foo" to add')
  })

  test('"mode add ssr" with an unknown --webserver exits 1', async () => {
    const { code, output } = await runQuasar(
      ['mode', 'add', 'ssr', '--webserver', 'nginx'],
      appDir
    )

    expect(code, output).toBe(1)
    expect(output).toContain('Unknown SSR webserver "nginx"')
  })

  test('--webserver outside of "add ssr" exits 1', async () => {
    const { code, output } = await runQuasar(
      ['mode', 'remove', 'pwa', '--yes', '--webserver', 'hono'],
      appDir
    )

    expect(code, output).toBe(1)
    expect(output).toContain(
      'The --webserver parameter only applies to "quasar mode add ssr"'
    )
  })

  test('--filename-based-routing outside of "add ssg" exits 1', async () => {
    const { code, output } = await runQuasar(
      ['mode', 'add', 'pwa', '--filename-based-routing'],
      appDir
    )

    expect(code, output).toBe(1)
    expect(output).toContain(
      'The --filename-based-routing parameter only applies to "quasar mode add ssg"'
    )
  })

  test('--app-id outside of "add cordova/capacitor" exits 1', async () => {
    const { code, output } = await runQuasar(
      ['mode', 'add', 'ssr', '--app-id', 'org.quasar.app'],
      appDir
    )

    expect(code, output).toBe(1)
    expect(output).toContain(
      'The --app-id parameter only applies to ' +
        '"quasar mode add cordova" / "quasar mode add capacitor"'
    )
  })

  test('--app-name outside of "add capacitor" exits 1', async () => {
    const { code, output } = await runQuasar(
      ['mode', 'add', 'cordova', '--app-name', 'My App'],
      appDir
    )

    expect(code, output).toBe(1)
    expect(output).toContain(
      'The --app-name parameter only applies to "quasar mode add capacitor"'
    )
  })

  test('adding/removing SPA mode exits 1 (built-in mode)', async () => {
    const { code, output } = await runQuasar(['mode', 'add', 'spa'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain(
      'SPA mode is included by default. No need to add or remove it.'
    )
  })
})
