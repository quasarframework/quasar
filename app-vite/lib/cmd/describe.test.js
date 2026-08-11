import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'

const binFile = fileURLToPath(new URL('../../bin/quasar.js', import.meta.url))
const playgroundDir = fileURLToPath(
  new URL('../../playground-js', import.meta.url)
)

// the positive test needs the quasar package (with its built /dist)
// to be available in the playground app
const hasQuasarApiFiles = existsSync(
  join(playgroundDir, 'node_modules/quasar/dist/api/QBtn.json')
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

describe('[describe.js]', () => {
  test.skipIf(!hasQuasarApiFiles)(
    'describes the QBtn component API',
    async () => {
      const { code, output } = await runQuasar(['describe', 'QBtn'])

      expect(code, output).toBe(0)
      expect(output).toContain('Describing QBtn component API')
      expect(output).toContain(
        "Description is based on your project's Quasar version"
      )

      for (const section of ['Properties', 'Slots', 'Events', 'Methods']) {
        expect(output).toContain(section)
      }
    }
  )

  test('errors out on an unknown API entry', async () => {
    const { code, output } = await runQuasar(['describe', 'QNoSuchApiZzz'])

    expect(code, output).toBe(1)
    expect(output).toContain('No API found for requested "QNoSuchApiZzz"')
  })
})
