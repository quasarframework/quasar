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

const envKeys = [
  'E2E_INSTALL',
  'E2E_SCRIPT',
  'E2E_LINTER',
  'E2E_FBR',
  'E2E_ALL_PRESETS'
]

// A single combo can be selected through the E2E_* environment variables,
// which is how the project-creation-tests GitHub workflow distributes the
// combos across its test-app matrix jobs.
// With no E2E_* variable set (local runs), the full matrix is covered.
function getCombos() {
  if (envKeys.some(key => process.env[key] !== void 0)) {
    return [
      {
        install: process.env.E2E_INSTALL || 'pnpm',
        script: process.env.E2E_SCRIPT || 'js',
        linter: process.env.E2E_LINTER || 'oxlint',
        fbr: process.env.E2E_FBR === 'true',
        allPresets: process.env.E2E_ALL_PRESETS === 'true'
      }
    ]
  }

  const combos = []
  for (const install of ['pnpm', 'npm', 'yarn']) {
    for (const script of ['js', 'ts']) {
      for (const linter of ['oxlint', 'eslint']) {
        for (const fbr of [false, true]) {
          for (const allPresets of [false, true]) {
            combos.push({ install, script, linter, fbr, allPresets })
          }
        }
      }
    }
  }
  return combos
}

const comboName = combo =>
  [
    'app',
    combo.script,
    combo.install,
    combo.linter,
    combo.fbr ? 'fbr' : '',
    combo.allPresets ? 'allPresets' : ''
  ]
    .filter(Boolean)
    .join('-')

const workDir = mkdtempSync(join(tmpdir(), 'create-quasar-e2e-'))

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
      'app',
      '--install',
      combo.install
    ]

    if (combo.script === 'ts') scaffoldArgs.push('--preset', 'typescript')
    scaffoldArgs.push('--preset', combo.linter)
    if (combo.fbr) scaffoldArgs.push('--preset', 'fbr')
    if (combo.allPresets) {
      scaffoldArgs.push(
        '--preset',
        'sass',
        '--preset',
        'i18n',
        '--preset',
        'pinia'
      )
    }
    scaffoldArgs.push('--defaults', '--no-git')

    const repro = makeRepro(scaffoldArgs, name)
    const stepTest = createStepTest()

    // reclaim the disk space before moving on to the next combo
    afterAll(() => {
      rmSync(projectFolder, { recursive: true, force: true })
    })

    stepTest(
      'scaffolds the project and installs its dependencies',
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
      }
    )

    stepTest('lints the project', async () => {
      const { code, output } = await run(
        combo.install,
        ['run', 'lint'],
        projectFolder
      )
      expect(code, output + repro(`${combo.install} run lint`)).toBe(0)
    })

    stepTest('builds the project', async () => {
      const { code, output } = await run(
        combo.install,
        ['run', 'build'],
        projectFolder
      )
      expect(code, output + repro(`${combo.install} run build`)).toBe(0)
      expect(
        existsSync(join(projectFolder, 'dist/spa/index.html')),
        repro(`${combo.install} run build`)
      ).toBe(true)
    })

    stepTest('serves the project in development mode', async () => {
      // prevent the dev server from opening a browser window
      disableDevServerOpen(join(projectFolder, `quasar.config.${combo.script}`))

      await testDevServer(
        combo.install,
        ['run', 'dev'],
        projectFolder,
        repro(`${combo.install} run dev`)
      )
    })
  }
)
