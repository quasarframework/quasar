import { execFile } from 'node:child_process'
import {
  existsSync,
  globSync,
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
const cliDir = fileURLToPath(new URL('../..', import.meta.url))

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

const appDirs = []
afterAll(() => {
  for (const dir of appDirs) {
    rmSync(dir, { recursive: true, force: true })
  }
})

// a minimal app around the given quasar.config content;
// fresh per variant so leftovers cannot leak between them
function makeApp(configContent, configExt = 'js') {
  const appDir = realpathSync(
    mkdtempSync(join(tmpdir(), 'app-vite-cmd-prepare-'))
  )
  appDirs.push(appDir)

  writeFileSync(join(appDir, `quasar.config.${configExt}`), configContent)
  writeFileSync(
    join(appDir, 'package.json'),
    '{ "name": "cmd-prepare-app", "version": "0.0.1", "private": true, "type": "module" }\n'
  )
  writeFileSync(
    join(appDir, 'index.html'),
    '<html><body><!-- quasar:entry-point --></body></html>\n'
  )
  mkdirSync(join(appDir, 'src'))

  // resolvable app deps: the banner needs "quasar", a defineConfig
  // import needs "@quasar/app-vite"
  mkdirSync(join(appDir, 'node_modules/@quasar'), { recursive: true })
  symlinkSync(
    realpathSync(join(playgroundDir, 'node_modules/quasar')),
    join(appDir, 'node_modules/quasar')
  )
  symlinkSync(cliDir, join(appDir, 'node_modules/@quasar/app-vite'))

  return appDir
}

const leftoverTempFiles = appDir =>
  globSync(join(appDir, 'quasar.config.*.temporary.compiled*'))

describe('[prepare.js] quasar.config variants', () => {
  test.each([
    ['a plain function', 'export default function () {\n  return {}\n}\n'],
    [
      'an async function',
      'export default async function () {\n  return {}\n}\n'
    ],
    [
      'a defineConfig-wrapped function',
      "import { defineConfig } from '#q-app'\n" +
        'export default defineConfig(() => ({}))\n'
    ]
  ])('accepts %s', async (_, configContent) => {
    const appDir = makeApp(configContent)
    const { code, output } = await runQuasar(['prepare'], appDir)

    expect(code, output).toBe(0)
    expect(existsSync(join(appDir, '.quasar/tsconfig.json')), output).toBe(true)
    // the compiled config is a temporary artifact; success cleans it up
    expect(leftoverTempFiles(appDir)).toHaveLength(0)
  })

  test('accepts a TypeScript config file', async () => {
    const appDir = makeApp(
      'interface Whatever { name: string }\n' +
        'export default function (): Record<string, unknown> {\n' +
        "  const dummy: Whatever = { name: 'e2e' }\n" +
        '  return { htmlVariables: { productName: dummy.name } }\n' +
        '}\n',
      'ts'
    )
    const { code, output } = await runQuasar(['prepare'], appDir)

    expect(code, output).toBe(0)
    expect(leftoverTempFiles(appDir)).toHaveLength(0)
  })

  test('injects node/module tokens and shims .vue imports while compiling', async () => {
    // the config file IS the test subject: it throws unless the
    // inject-replacements plugin provided working __dirname/__filename/
    // import.meta values and the vue-shim plugin emptied the .vue import
    const appDir = makeApp(
      "import * as vueShimProbe from './src/App.vue'\n" +
        '\n' +
        'const appDir = process.cwd()\n' +
        'const configFileRE = /[\\\\/]quasar\\.config\\.[cm]?[jt]s$/\n' +
        'const checks = {\n' +
        '  dirname: __dirname === appDir,\n' +
        '  filename: configFileRE.test(__filename) && __filename.startsWith(appDir),\n' +
        "  importMetaUrl: import.meta.url.startsWith('file://'),\n" +
        '  importMetaDirname: import.meta.dirname === __dirname,\n' +
        '  importMetaFilename: import.meta.filename === __filename,\n' +
        '  vueShim: Object.keys(vueShimProbe).length === 0\n' +
        '}\n' +
        '\n' +
        'const failed = Object.entries(checks)\n' +
        '  .filter(([, ok]) => !ok)\n' +
        '  .map(([name]) => name)\n' +
        'if (failed.length !== 0) {\n' +
        "  throw new Error('config self-test failed: ' + failed.join(', '))\n" +
        '}\n' +
        '\n' +
        'export default function () {\n  return {}\n}\n'
    )
    writeFileSync(
      join(appDir, 'src/App.vue'),
      '<template><router-view /></template>\n'
    )

    const { code, output } = await runQuasar(['prepare'], appDir)

    expect(code, output).toBe(0)
    expect(output).not.toContain('config self-test failed')
  })

  test('rejects a non-function default export', async () => {
    const appDir = makeApp('export default { framework: {} }\n')
    const { code, output } = await runQuasar(['prepare'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain(
      'The default export value of the quasar.config file is not a function.'
    )
    expect(leftoverTempFiles(appDir)).toHaveLength(0)
  })

  test('rejects a function not returning an Object', async () => {
    const appDir = makeApp("export default function () {\n  return 'nope'\n}\n")
    const { code, output } = await runQuasar(['prepare'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain(
      'The quasar.config file does not default exports an Object.'
    )
    expect(leftoverTempFiles(appDir)).toHaveLength(0)
  })

  test('surfaces runtime errors and keeps the compiled file for debugging', async () => {
    const appDir = makeApp(
      'export default function () {\n' +
        "  throw new Error('boom from config')\n" +
        '}\n'
    )
    const { code, output } = await runQuasar(['prepare'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain('boom from config')
    expect(output).toContain('The quasar.config file has runtime errors')
    // deliberately left behind so the stack can be checked against it
    // ("quasar clean --qconf" removes it)
    expect(leftoverTempFiles(appDir)).toHaveLength(1)
  })

  test('surfaces import-time errors', async () => {
    const appDir = makeApp(
      "throw new Error('module level boom')\n" +
        'export default function () {\n  return {}\n}\n'
    )
    const { code, output } = await runQuasar(['prepare'], appDir)

    expect(code, output).toBe(1)
    expect(output).toContain('module level boom')
  })

  test('outside of a Quasar project it refuses to run', async () => {
    const emptyDir = realpathSync(
      mkdtempSync(join(tmpdir(), 'app-vite-cmd-prepare-empty-'))
    )
    appDirs.push(emptyDir)

    const { code, output } = await runQuasar(['prepare'], emptyDir)

    expect(code, output).toBe(1)
    expect(output).toContain(
      'This command must be executed inside a Quasar project folder.'
    )
  })
})
