import { execFile } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { cliPkg } from '../lib/cli-pkg.js'

const binFile = join(import.meta.dirname, '../bin/create-quasar.js')

const workDir = mkdtempSync(join(tmpdir(), 'create-quasar-cli-'))

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true })
})

function runCli(args, { cwd = workDir } = {}) {
  const env = { ...process.env, NO_UPDATE_NOTIFIER: '1' }
  // simulate a direct invocation (not through a package manager's
  // "create" command), so --install accepts a package manager name
  delete env.npm_config_user_agent
  delete env.npm_lifecycle_event

  return new Promise(resolve => {
    execFile(
      process.execPath,
      [binFile, '--no-color', ...args],
      { cwd, env },
      (error, stdout, stderr) => {
        resolve({ code: error?.code ?? 0, stdout, stderr })
      }
    )
  })
}

describe('[bin/create-quasar.js]', () => {
  test('--version prints the package version', async () => {
    const { code, stdout } = await runCli(['--version'])
    expect(code).toBe(0)
    expect(stdout.trim()).toBe(cliPkg.version)
  })

  test('--help prints the usage information', async () => {
    const { code, stdout } = await runCli(['--help'])
    expect(code).toBe(0)
    expect(stdout).toContain('Scaffolds Quasar Apps & App Extensions')
    expect(stdout).toContain('--template, -t')
    expect(stdout).toContain('--preset')
  })

  test('fails on an unknown option', async () => {
    const { code, stderr } = await runCli(['--bogus-option'])
    expect(code).toBe(1)
    expect(stderr).toContain('--bogus-option')
  })

  test('fails on multiple positional arguments', async () => {
    const { code, stderr } = await runCli(['dir-one', 'dir-two'])
    expect(code).toBe(1)
    expect(stderr).toContain('Too many positional arguments')
  })

  test('fails on an invalid template', async () => {
    const { code, stderr } = await runCli(['--template', 'nuxt'])
    expect(code).toBe(1)
    expect(stderr).toContain('Invalid template specified: nuxt')
  })

  test('fails on an invalid preset for template "app"', async () => {
    const { code, stderr } = await runCli([
      '--template',
      'app',
      '--preset',
      'bogus'
    ])
    expect(code).toBe(1)
    expect(stderr).toContain('Invalid preset specified: bogus')
  })

  test('fails when both oxlint and eslint presets are requested', async () => {
    const { code, stderr } = await runCli([
      '--template',
      'app',
      '--preset',
      'oxlint',
      '--preset',
      'eslint'
    ])
    expect(code).toBe(1)
    expect(stderr).toContain('oxlint and eslint cannot be used together')
  })

  test('fails on an invalid preset for template "ae"', async () => {
    const { code, stderr } = await runCli([
      '--template',
      'ae',
      '--preset',
      'pinia'
    ])
    expect(code).toBe(1)
    expect(stderr).toContain('Invalid preset specified: pinia')
  })

  test('fails on --product with template "ae"', async () => {
    const { code, stderr } = await runCli([
      '--template',
      'ae',
      '--product',
      'My Product'
    ])
    expect(code).toBe(1)
    expect(stderr).toContain('--product option is not applicable')
  })

  test('fails on an invalid package manager with --install', async () => {
    const { code, stderr } = await runCli([
      '--template',
      'app',
      '--install',
      'bower'
    ])
    expect(code).toBe(1)
    expect(stderr).toContain(
      'Invalid package manager specified with --install: bower'
    )
  })

  test('fails on a non-pnpm package manager for template "ae"', async () => {
    const { code, stderr } = await runCli([
      '--template',
      'ae',
      '--install',
      'npm'
    ])
    expect(code).toBe(1)
    expect(stderr).toContain('Allowed value is "pnpm"')
  })

  test('fails on an invalid --name', async () => {
    const { code, stderr } = await runCli([
      '--template',
      'app',
      '--name',
      'Invalid Name!'
    ])
    expect(code).toBe(1)
    expect(stderr).toContain('Invalid package name specified with --name')
  })

  test('refuses to run inside a Quasar project folder', async () => {
    const insideDir = join(workDir, 'existing-project')
    mkdirSync(insideDir, { recursive: true })
    writeFileSync(join(insideDir, 'quasar.config.js'), 'export default {}')

    const { code, stderr } = await runCli([], { cwd: insideDir })
    expect(code).toBe(1)
    expect(stderr).toContain(
      'must NOT be executed inside of a Quasar project folder'
    )
  })

  test('refuses to scaffold with --defaults into a non-empty directory', async () => {
    const targetDir = join(workDir, 'non-empty-target')
    mkdirSync(targetDir, { recursive: true })
    writeFileSync(join(targetDir, 'keep.txt'), 'keep')

    const { code, stdout, stderr } = await runCli([
      'non-empty-target',
      '--template',
      'app',
      '--defaults'
    ])
    expect(code).toBe(1)
    expect(stdout + stderr).toContain(
      'Target directory "non-empty-target" is not empty'
    )
  })
})
