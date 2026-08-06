import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect } from 'vitest'

import { binFile, createStepTest, run } from './e2e-utils.js'

const createQuasarBin = join(
  import.meta.dirname,
  '../../../create-quasar/bin/create-quasar.js'
)

const workDir = mkdtempSync(join(tmpdir(), 'quasar-cli-project-'))
const projectFolder = join(workDir, 'test-project')

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true })
})

const stepTest = createStepTest()

// the global CLI behaviors that need a real Quasar project:
// deferral to the locally installed CLI and the upgrade command
describe('[e2e] project', () => {
  stepTest('scaffolds a project with installed dependencies', async () => {
    const { code, output } = await run(
      process.execPath,
      [
        createQuasarBin,
        '--no-color',
        'test-project',
        '--template',
        'app',
        '--install',
        'pnpm',
        '--preset',
        'oxlint',
        '--defaults',
        '--no-git'
      ],
      workDir
    )
    expect(code, output).toBe(0)
    expect(existsSync(join(projectFolder, 'node_modules'))).toBe(true)
  })

  stepTest('defers "info" to the locally installed CLI', async () => {
    const { code, output } = await run(
      process.execPath,
      [binFile, 'info'],
      projectFolder
    )
    expect(code, output).toBe(0)

    // This section only exists in the local (@quasar/app-vite) CLI output;
    // the global CLI fallback of the "info" command does not print it.
    // The marker is owned by app-vite/lib/cmd/info.js (which carries a
    // breadcrumb comment) and is also pinned by app-vite's own info test.
    expect(output, output).toContain('Important local packages')
    expect(output, output).toContain('@quasar/app-vite')
  })

  stepTest('"upgrade" reports the project as up to date', async () => {
    const { code, output } = await run(
      process.execPath,
      [binFile, 'upgrade'],
      projectFolder
    )
    expect(code, output).toBe(0)
    expect(output, output).toContain('Quasar Packages Upgrade')

    // a freshly scaffolded project either is up to date or gets
    // an upgrade suggestion — both must render a clean summary
    expect(output, output).toMatch(/up to date|quasar upgrade -i/)
  })

  stepTest('"upgrade -m" inquires the registry for majors', async () => {
    const { code, output } = await run(
      process.execPath,
      [binFile, 'upgrade', '-m'],
      projectFolder
    )
    expect(code, output).toBe(0)
    expect(output, output).toContain('Inquired NPM registry for updates')
  })
})
