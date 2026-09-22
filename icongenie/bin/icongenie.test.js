import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

import { packageJson } from '../lib/utils/package-json.js'

const binFile = join(import.meta.dirname, 'icongenie.js')

const env = {
  ...process.env,
  FORCE_COLOR: '0',
  NO_UPDATE_NOTIFIER: '1'
}
// vitest points NODE_PATH at the monorepo's pnpm store, which would
// let the CLI resolve host packages that a real user would not have
delete env.NODE_PATH

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [binFile, ...args], {
      // outside any project
      cwd: tmpdir(),
      env
    })

    let output = ''
    child.stdout.on('data', chunk => {
      output += chunk
    })
    child.stderr.on('data', chunk => {
      output += chunk
    })

    child.on('error', reject)
    child.on('close', code => resolve({ code, output }))
  })
}

describe('icongenie', () => {
  test('--version', async () => {
    const { code, output } = await run(['--version'])

    expect(code).toBe(0)
    expect(output.trim()).toBe(packageJson.version)
    const short = await run(['-v'])
    expect(short.output.trim()).toBe(packageJson.version)
  })

  test('help, by default and on request', async () => {
    for (const args of [[], ['help'], ['h'], ['--help'], ['-h']]) {
      const { code, output } = await run(args)

      expect(code, args.join(' ')).toBe(0)
      expect(output, args.join(' ')).toContain('icongenie <command>')
    }
  })

  test('an unknown command falls back to help with a warning', async () => {
    const { code, output } = await run(['nope'])

    expect(code).toBe(0)
    expect(output).toContain('Unknown command specified: "nope"')
    expect(output).toContain('icongenie <command>')
  })

  test('options before the command are reported', async () => {
    const { code, output } = await run(['--quality', '5', 'generate'])

    expect(code).toBe(0)
    expect(output).toContain('Command must come before the options')
  })

  test('each command has its own help', async () => {
    for (const cmd of ['generate', 'verify', 'profile']) {
      const { code, output } = await run([cmd, '--help'])

      expect(code, cmd).toBe(0)
      expect(output, cmd).toContain(`$ icongenie ${cmd}`)
    }
    // the aliases
    for (const [alias, cmd] of [
      ['g', 'generate'],
      ['v', 'verify'],
      ['p', 'profile']
    ]) {
      const { output } = await run([alias, '-h'])
      expect(output, alias).toContain(`$ icongenie ${cmd}`)
    }
  })

  test('an unknown option prints the help and fails', async () => {
    const { code, output } = await run(['generate', '--bogus'])

    expect(code).toBe(1)
    expect(output).toContain('$ icongenie generate')
    expect(output).toContain("'--bogus'")
  })

  test('invalid param values fail before generating anything', async () => {
    const cases = [
      [['generate', '--quality', '13'], 'Invalid quality level'],
      [['generate', '--padding', '60%'], 'Invalid padding'],
      [['generate', '--png-color', 'red'], 'Invalid pngColor color'],
      [['generate', '--icon', 'missing.png'], 'does not exists'],
      [['generate', '--mode', 'nope'], 'Invalid mode'],
      [['generate', '--profile', 'missing.json'], 'does not point to a file'],
      [['verify', '--filter', 'nope'], 'Unknown filter'],
      [['profile', '--assets', 'spa'], 'The "output" param is required']
    ]

    for (const [args, message] of cases) {
      const { code, output } = await run(args)

      expect(code, args.join(' ')).toBe(1)
      expect(output, args.join(' ')).toContain(message)
    }
  })
})
