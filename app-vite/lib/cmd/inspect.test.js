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

// a minimal app guarantees NO non-SPA mode is installed, regardless of
// what previous playground e2e runs left behind
const appDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'app-vite-cmd-inspect-'))
)

writeFileSync(
  join(appDir, 'quasar.config.js'),
  'export default function () {\n  return {}\n}\n'
)
writeFileSync(
  join(appDir, 'package.json'),
  '{ "name": "cmd-inspect-app", "version": "0.0.1", "private": true, "type": "module" }\n'
)
writeFileSync(
  join(appDir, 'index.html'),
  '<html><body><!-- quasar:entry-point --></body></html>\n'
)
mkdirSync(join(appDir, 'src'))

// the CLI banner resolves the app's quasar package before any other
// validation, so the minimal app needs it to be resolvable
mkdirSync(join(appDir, 'node_modules'))
symlinkSync(
  realpathSync(join(playgroundDir, 'node_modules/quasar')),
  join(appDir, 'node_modules/quasar')
)

afterAll(() => {
  rmSync(appDir, { recursive: true, force: true })
})

describe('[inspect.js]', () => {
  test('shows the dev Vite config by default', async () => {
    const { code, output } = await runQuasar(['inspect'], playgroundDir)

    expect(code, output).toBe(0)
    expect(output).toMatch(/Dev mode\.+ SPA/)
    expect(output).toContain('Showing "vite" config (for Vite) with depth of 2')
    expect(output).toContain('plugins:')
    expect(output).toContain('Depth used: 2')
  })

  test('"-c build" resolves the build variant', async () => {
    const { code, output } = await runQuasar(
      ['inspect', '-c', 'build', '-p', 'build.outDir'],
      playgroundDir
    )

    expect(code, output).toBe(0)
    expect(output).toMatch(/Build mode\.+ SPA/)
    // --path narrows the output down to the requested property
    expect(output).toContain(join(playgroundDir, 'dist/spa'))
    expect(output).not.toContain('plugins:')
  })

  test('"--depth" is reflected in the output', async () => {
    const { code, output } = await runQuasar(
      ['inspect', '-d', '4'],
      playgroundDir
    )

    expect(code, output).toBe(0)
    expect(output).toContain('with depth of 4')
    expect(output).toContain('Depth used: 4')
  })

  test('"--thread" selects a specific thread and validates it', async () => {
    const ok = await runQuasar(['inspect', '-t', 'vite'], playgroundDir)
    expect(ok.code, ok.output).toBe(0)
    expect(ok.output).toContain('Showing "vite" config')

    const bad = await runQuasar(['inspect', '-t', 'bogus'], playgroundDir)
    expect(bad.code, bad.output).toBe(1)
    expect(bad.output).toContain(
      'Requested thread for inspection is NOT available'
    )
  })

  test('inspecting a non-installed mode exits 1', async () => {
    const { code, output } = await runQuasar(['inspect', '-m', 'ssr'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain('Requested mode for inspection is NOT installed.')
  })

  test('an app without installed dependencies gets a clear error', async () => {
    const bareAppDir = realpathSync(
      mkdtempSync(join(tmpdir(), 'app-vite-cmd-inspect-bare-'))
    )
    writeFileSync(
      join(bareAppDir, 'quasar.config.js'),
      'export default function () {\n  return {}\n}\n'
    )
    writeFileSync(
      join(bareAppDir, 'package.json'),
      '{ "name": "bare-app", "version": "0.0.1", "private": true, "type": "module" }\n'
    )

    try {
      const { code, output } = await runQuasar(['inspect'], bareAppDir)

      expect(code, output).toBe(1)
      expect(output).toContain('The project dependencies are not installed.')
      expect(output).not.toContain('TypeError')
    } finally {
      rmSync(bareAppDir, { recursive: true, force: true })
    }
  })

  test('help exits 0', async () => {
    const { code, output } = await runQuasar(['inspect', '-h'], playgroundDir)

    expect(code, output).toBe(0)
    expect(output).toContain('Inspect Quasar generated Vite config')
  })
})
