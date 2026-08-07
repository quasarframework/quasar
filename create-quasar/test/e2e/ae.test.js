import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect } from 'vitest'

import {
  binFile,
  createStepTest,
  disableDevServerOpen,
  makeRepro,
  run,
  testDevServer
} from './e2e-utils.js'
import { assertLocalQuasarInstall } from './local-registry.js'

const envKeys = ['E2E_SCRIPT', 'E2E_LINT']

// A single combo can be selected through the E2E_* environment variables,
// which is how the project-creation-tests GitHub workflow distributes the
// combos across its test-ae matrix jobs.
// With no E2E_* variable set (local runs), the full matrix is covered.
function getCombos() {
  if (envKeys.some(key => process.env[key] !== void 0)) {
    return [
      {
        script: process.env.E2E_SCRIPT || 'js',
        lint: process.env.E2E_LINT !== 'false'
      }
    ]
  }

  const combos = []
  for (const script of ['js', 'ts']) {
    for (const lint of [true, false]) {
      combos.push({ script, lint })
    }
  }
  return combos
}

const comboName = combo =>
  ['ae', combo.script, combo.lint ? 'lint' : ''].filter(Boolean).join('-')

const workDir = mkdtempSync(join(tmpdir(), 'create-quasar-e2e-ae-'))

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true })
})

describe.each(getCombos().map(combo => [comboName(combo), combo]))(
  '[e2e] %s',
  (name, combo) => {
    const projectFolder = join(workDir, name)

    const scaffoldArgs = [
      '--no-color',
      name,
      '--template',
      'ae',
      '--install',
      'pnpm'
    ]

    if (combo.script === 'ts') scaffoldArgs.push('--preset', 'typescript')
    if (combo.lint) scaffoldArgs.push('--preset', 'oxlint')
    scaffoldArgs.push(
      '--preset',
      'prompts',
      '--preset',
      'install',
      '--preset',
      'uninstall',
      '--defaults',
      '--no-git'
    )

    const repro = makeRepro(scaffoldArgs, name)
    const stepTest = createStepTest()

    // reclaim the disk space before moving on to the next combo
    afterAll(() => {
      rmSync(projectFolder, { recursive: true, force: true })
    })

    stepTest(
      'scaffolds the App Extension and installs its dependencies',
      async () => {
        const { code, output } = await run(
          process.execPath,
          [binFile, ...scaffoldArgs],
          workDir
        )
        expect(code, output + repro()).toBe(0)
        expect(existsSync(join(projectFolder, 'package.json')), repro()).toBe(
          true
        )

        // a failed dependency install does not fail the CLI,
        // so it needs to be verified explicitly
        expect(existsSync(join(projectFolder, 'node_modules')), repro()).toBe(
          true
        )

        // --no-git skips the git repository initialization
        expect(existsSync(join(projectFolder, '.git')), repro()).toBe(false)

        // the install must have used the local monorepo packages,
        // never published ones
        assertLocalQuasarInstall(projectFolder)
      }
    )

    stepTest(
      'lints the project',
      async () => {
        const { code, output } = await run(
          'pnpm',
          ['run', 'lint'],
          projectFolder
        )
        expect(code, output + repro('pnpm run lint')).toBe(0)
      },
      { runIf: combo.lint }
    )

    stepTest('serves the playground in development mode', async () => {
      // prevent the dev server from opening a browser window
      disableDevServerOpen(
        join(projectFolder, `playground/quasar.config.${combo.script}`)
      )

      await testDevServer(
        'pnpm',
        ['run', 'dev'],
        projectFolder,
        repro('pnpm run dev')
      )
    })
  }
)
