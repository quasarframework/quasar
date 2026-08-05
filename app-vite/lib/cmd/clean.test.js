import { execFile } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeEach, describe, expect, test } from 'vitest'

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

// minimal Quasar app dir with fake build artifacts
const appDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-cmd-clean-')))

const entryDir = join(appDir, '.quasar')
const distDir = join(appDir, 'dist')
const qconfTempFile = join(
  appDir,
  'quasar.config.js.temporary.compiled.123.mjs'
)

writeFileSync(
  join(appDir, 'quasar.config.js'),
  'export default function () {\n  return {}\n}\n'
)
writeFileSync(
  join(appDir, 'package.json'),
  '{ "name": "cmd-clean-app", "version": "0.0.1", "private": true, "type": "module" }\n'
)
mkdirSync(join(appDir, 'src'))

const cacheRootDir = join(appDir, 'node_modules', '.q-cache')

function seedArtifacts() {
  mkdirSync(join(entryDir, 'dev-spa'), { recursive: true })
  writeFileSync(join(entryDir, 'dev-spa/app.js'), '')

  // one cache dir per runType-mode combo
  mkdirSync(join(cacheRootDir, 'dev-spa'), { recursive: true })
  writeFileSync(join(cacheRootDir, 'dev-spa/entry.json'), '{}')
  mkdirSync(join(cacheRootDir, 'prod-electron-darwin'), { recursive: true })
  writeFileSync(join(cacheRootDir, 'prod-electron-darwin/entry.json'), '{}')

  mkdirSync(join(distDir, 'spa'), { recursive: true })
  writeFileSync(join(distDir, 'spa/index.html'), '')

  writeFileSync(qconfTempFile, '')
}

beforeEach(seedArtifacts)

afterAll(() => {
  rmSync(appDir, { recursive: true, force: true })
})

describe('[clean.js]', () => {
  test('bare "quasar clean" cleans all build artifacts', async () => {
    const { code, output } = await runQuasar(['clean'], appDir)

    expect(code, output).toBe(0)
    expect(output).toContain('Cleaned generated entry points')
    expect(output).toContain('Cleaned dev/build cache')
    expect(output).toContain('Cleaned /dist folder')
    expect(output).toContain('Cleaned 1 temporary compiled quasar.config file')

    expect(existsSync(entryDir)).toBe(false)
    // every per-mode cache dir goes away, not just the mode-less one
    expect(existsSync(cacheRootDir)).toBe(false)
    // the /dist folder itself is kept, but emptied
    expect(existsSync(distDir)).toBe(true)
    expect(readdirSync(distDir)).toHaveLength(0)
    expect(existsSync(qconfTempFile)).toBe(false)
  })

  test('"clean --cache" removes all per-mode cache dirs only', async () => {
    const { code, output } = await runQuasar(['clean', '--cache'], appDir)

    expect(code, output).toBe(0)
    expect(existsSync(cacheRootDir)).toBe(false)
    expect(existsSync(join(entryDir, 'dev-spa/app.js'))).toBe(true)
    expect(existsSync(join(distDir, 'spa/index.html'))).toBe(true)
    expect(existsSync(qconfTempFile)).toBe(true)
  })

  test('"clean --entry" only removes the generated entry points', async () => {
    const { code, output } = await runQuasar(['clean', '--entry'], appDir)

    expect(code, output).toBe(0)
    expect(output).toContain('Cleaned generated entry points')
    expect(output).not.toContain('Cleaned /dist folder')

    expect(existsSync(entryDir)).toBe(false)
    expect(existsSync(join(distDir, 'spa/index.html'))).toBe(true)
    expect(existsSync(qconfTempFile)).toBe(true)
  })

  test('"clean --dist" only empties the /dist folder', async () => {
    const { code, output } = await runQuasar(['clean', '--dist'], appDir)

    expect(code, output).toBe(0)
    expect(output).toContain('Cleaned /dist folder')
    expect(output).not.toContain('Cleaned generated entry points')

    expect(existsSync(distDir)).toBe(true)
    expect(readdirSync(distDir)).toHaveLength(0)
    expect(existsSync(entryDir)).toBe(true)
    expect(existsSync(qconfTempFile)).toBe(true)
  })

  test('"clean --qconf" only removes temporary compiled quasar.config files', async () => {
    const { code, output } = await runQuasar(['clean', '--qconf'], appDir)

    expect(code, output).toBe(0)
    expect(output).toContain('Cleaned 1 temporary compiled quasar.config file')
    expect(output).not.toContain('Cleaned generated entry points')
    expect(output).not.toContain('Cleaned /dist folder')

    expect(existsSync(qconfTempFile)).toBe(false)
    expect(existsSync(entryDir)).toBe(true)
    expect(existsSync(join(distDir, 'spa/index.html'))).toBe(true)
  })
})
