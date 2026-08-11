import { execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'

const binFile = fileURLToPath(new URL('../../bin/quasar.js', import.meta.url))
const { version } = createRequire(import.meta.url)('../../package.json')

function runQuasar(args, cwd = tmpdir()) {
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

const commandList = [
  'dev',
  'build',
  'prepare',
  'clean',
  'inspect',
  'describe',
  'ext',
  'run',
  'mode',
  'info',
  'new'
]

describe('[help.js]', () => {
  test('bare "quasar" prints the help screen and exits 0', async () => {
    const { code, output } = await runQuasar([])

    expect(code, output).toBe(0)
    expect(output).toContain(`Running @quasar/app-vite v${version}`)
    expect(output).toContain('Example usage')
    expect(output).toContain('$ quasar <command> <options>')
    expect(output).toContain('Commands')
  })

  test.each(['help', 'h', '--help', '-h'])(
    '"quasar %s" prints the help screen and exits 0',
    async cmd => {
      const { code, output } = await runQuasar([cmd])

      expect(code, output).toBe(0)
      expect(output).toContain(`Running @quasar/app-vite v${version}`)
      expect(output).toContain('Example usage')
    }
  )

  test.each(['-v', '--version'])(
    '"quasar %s" prints the CLI version and exits 0',
    async param => {
      const { code, output } = await runQuasar([param])

      expect(code, output).toBe(0)
      expect(output).toContain(`@quasar/app-vite ${version}`)
    }
  )

  test('unrecognized command exits 1 with an error message', async () => {
    const { code, output } = await runQuasar(['totallybogus'])

    expect(code, output).toBe(1)
    expect(output).toContain('Unrecognized command "totallybogus"')
    // it also prints the help screen so the user can recover
    expect(output).toContain('Example usage')
  })

  test('option supplied before the command exits 1', async () => {
    const { code, output } = await runQuasar(['--no-color', 'dev'])

    expect(code, output).toBe(1)
    expect(output).toContain('Command must come before the options')
  })

  test.each(commandList)(
    '"quasar %s --help" prints usage and exits 0',
    async cmd => {
      const { code, output } = await runQuasar([cmd, '--help'])

      expect(code, output).toBe(0)
      expect(output).toContain('Description')
      expect(output).toContain('Usage')
      expect(output).toContain(`$ quasar ${cmd}`)
    }
  )
})
