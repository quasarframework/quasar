import { execFile } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { cliPkg } from '../lib/cli-pkg.js'

const binFile = join(import.meta.dirname, './quasar.js')

const workDir = mkdtempSync(join(tmpdir(), 'quasar-cli-bin-'))

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true })
})

function runCli(args, { cwd = workDir } = {}) {
  const env = {
    ...process.env,
    FORCE_COLOR: '0',
    NO_UPDATE_NOTIFIER: '1',
    SKIP_YARN_COREPACK_CHECK: '1'
  }
  // vitest points NODE_PATH at the monorepo's pnpm store, which would
  // let the CLI resolve host packages that a real user would not have
  delete env.NODE_PATH

  return new Promise(resolve => {
    execFile(
      process.execPath,
      [binFile, ...args],
      { cwd, env },
      (error, stdout, stderr) => {
        resolve({ code: error?.code ?? 0, stdout, stderr })
      }
    )
  })
}

// a fake project folder with a stubbed local CLI package,
// to which the global CLI is expected to defer
function makeProjectWithLocalCli(name, pkgName, binRelativePath, binContent) {
  const projectDir = join(workDir, name)
  const pkgDir = join(projectDir, 'node_modules', pkgName)
  mkdirSync(join(pkgDir, 'bin'), { recursive: true })

  writeFileSync(join(projectDir, 'quasar.config.js'), 'export default {}')
  writeFileSync(
    join(pkgDir, 'package.json'),
    JSON.stringify({ name: pkgName, version: '0.0.1' })
  )
  writeFileSync(join(pkgDir, binRelativePath), binContent)

  return projectDir
}

describe('[bin/quasar.js]', () => {
  test('--version prints the CLI version', async () => {
    for (const flag of ['-v', '--version', '-V']) {
      const { code, stdout, stderr } = await runCli([flag])
      expect(code, stdout + stderr).toBe(0)
      expect(stdout.trim()).toBe(`${cliPkg.name} v${cliPkg.version}`)
    }
  })

  test('prints the usage information without a command', async () => {
    const { code, stdout, stderr } = await runCli([])
    expect(code, stdout + stderr).toBe(0)
    expect(stdout).toContain('Example usage')
    expect(stdout).toContain('$ quasar <command> <options>')
  })

  test.each(['help', '-h'])('"%s" prints the usage information', async cmd => {
    const { code, stdout, stderr } = await runCli([cmd])
    expect(code, stdout + stderr).toBe(0)
    expect(stdout).toContain('Example usage')
  })

  test('fails on an unknown command', async () => {
    const { code, stdout, stderr } = await runCli(['bogus-cmd'])
    expect(code, stdout + stderr).toBe(1)
    expect(stdout + stderr).toContain('Unknown command "bogus-cmd"')
  })

  test('fails when an option comes before the command', async () => {
    const { code, stdout, stderr } = await runCli(['--port', '4000'])
    expect(code, stdout + stderr).toBe(1)
    expect(stdout + stderr).toContain('Command must come before the options')
  })

  test('"create" points to the scaffolding commands', async () => {
    const { code, stdout, stderr } = await runCli(['create'])
    expect(code, stdout + stderr).toBe(0)
    expect(stdout).toContain('npm init quasar@latest')
    expect(stdout).toContain('pnpm create quasar@latest')
  })

  test('"info" prints machine information', async () => {
    const { code, stdout, stderr } = await runCli(['info'])
    expect(code, stdout + stderr).toBe(0)
    expect(stdout).toContain('Operating System')
    expect(stdout).toContain(cliPkg.name)
    expect(stdout).toContain(cliPkg.version)
  })

  test('"upgrade" refuses to run outside of a Quasar project', async () => {
    const { code, stdout, stderr } = await runCli(['upgrade'])
    expect(code, stdout + stderr).toBe(1)
    expect(stdout + stderr).toContain(
      'must be executed inside a Quasar project folder'
    )
  })

  test.each(['serve', 'upgrade', 'info'])(
    '"%s --help" prints the command usage',
    async cmd => {
      const { code, stdout, stderr } = await runCli([cmd, '--help'])
      expect(code, stdout + stderr).toBe(0)
      expect(stdout).toContain('Description')
      expect(stdout).toContain('Usage')
    }
  )

  test('defers to a local @quasar/app-vite CLI (ESM)', async () => {
    const projectDir = makeProjectWithLocalCli(
      'esm-project',
      '@quasar/app-vite',
      'bin/quasar.js',
      'console.log("LOCAL-CLI " + process.env.QUASAR_CLI_VERSION,' +
        ' process.argv.slice(2).join(" "))\n'
    )

    const { code, stdout, stderr } = await runCli(['dev', '--some-flag'], {
      cwd: projectDir
    })
    expect(code, stdout + stderr).toBe(0)
    // the global CLI passes its version down to the local CLI
    expect(stdout).toContain(`LOCAL-CLI ${cliPkg.version}`)
    // the command and its options reach the local CLI untouched
    expect(stdout).toContain('dev --some-flag')
  })

  test('defers to a legacy CJS local CLI', async () => {
    const projectDir = makeProjectWithLocalCli(
      'legacy-project',
      'quasar-cli',
      'bin/quasar',
      'console.log("LEGACY-CLI " + process.env.QUASAR_CLI_VERSION)\n'
    )

    const { code, stdout, stderr } = await runCli(['dev'], { cwd: projectDir })
    expect(code, stdout + stderr).toBe(0)
    expect(stdout).toContain(`LEGACY-CLI ${cliPkg.version}`)
  })
})
