import { execFile } from 'node:child_process'
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
import { fileURLToPath } from 'node:url'
import { afterAll, describe, expect, test } from 'vitest'

const binFile = fileURLToPath(new URL('../../bin/quasar.js', import.meta.url))

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

// minimal Quasar app dir; no tsconfig.json, so the JS templates are used
const appDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-cmd-new-')))

writeFileSync(
  join(appDir, 'quasar.config.js'),
  'export default function () {\n  return {}\n}\n'
)
writeFileSync(
  join(appDir, 'package.json'),
  '{ "name": "cmd-new-app", "version": "0.0.1", "private": true, "type": "module" }\n'
)
mkdirSync(join(appDir, 'src'))

afterAll(() => {
  rmSync(appDir, { recursive: true, force: true })
})

describe('[new.js]', () => {
  test('"new page" scaffolds src/pages/<name>.vue', async () => {
    const { code, output } = await runQuasar(
      ['new', 'page', 'TestPage'],
      appDir
    )
    const targetFile = join(appDir, 'src/pages/TestPage.vue')

    expect(code, output).toBe(0)
    expect(output).toContain('Generated page: src/pages/TestPage.vue')
    expect(output).toContain(
      'Make sure to reference it in src/router/routes.js'
    )
    expect(existsSync(targetFile)).toBe(true)
    expect(readFileSync(targetFile, 'utf8')).toContain('<q-page')
  })

  test('"new component" scaffolds src/components/<name>.vue', async () => {
    const { code, output } = await runQuasar(
      ['new', 'component', 'TestComp'],
      appDir
    )
    const targetFile = join(appDir, 'src/components/TestComp.vue')

    expect(code, output).toBe(0)
    expect(output).toContain('Generated component: src/components/TestComp.vue')
    expect(existsSync(targetFile)).toBe(true)
    expect(readFileSync(targetFile, 'utf8')).toContain('<template>')
  })

  test('"new boot" scaffolds src/boot/<name>.js', async () => {
    const { code, output } = await runQuasar(
      ['new', 'boot', 'testBoot'],
      appDir
    )
    const targetFile = join(appDir, 'src/boot/testBoot.js')

    expect(code, output).toBe(0)
    expect(output).toContain('Generated boot: src/boot/testBoot.js')
    expect(output).toContain(
      'Make sure to reference it in quasar.config file > boot'
    )
    expect(existsSync(targetFile)).toBe(true)
    expect(readFileSync(targetFile, 'utf8')).toContain('defineBoot')
  })

  test('invalid asset type exits 1', async () => {
    const { code, output } = await runQuasar(['new', 'bogus', 'Thing'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain('Invalid asset type: bogus')
    expect(output).toContain(
      'valid values: p|page|l|layout|c|component|s|store|b|boot|ssrmiddleware'
    )
  })

  test('missing asset name exits 1', async () => {
    const { code, output } = await runQuasar(['new', 'page'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain(
      'Wrong number of parameters (1). Expected at least 2.'
    )
  })
})
