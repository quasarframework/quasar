import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'

const binFile = fileURLToPath(new URL('../../bin/quasar.js', import.meta.url))
const playgroundDir = fileURLToPath(
  new URL('../../playground-js', import.meta.url)
)

function runQuasar(args, cwd = playgroundDir) {
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

describe('[info.js]', () => {
  test('prints machine & app information and exits 0', async () => {
    const { code, output } = await runQuasar(['info'])

    expect(code, output).toBe(0)
    expect(output).toContain('Operating System')
    expect(output).toContain('Node.js')
    expect(output).toContain('Global packages')
    expect(output).toContain('Important local packages')
    expect(output).toContain('@quasar/app-vite')
    expect(output).toContain('Quasar App Extensions')
  })
})
