import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { createQuasarScript } from '../templates/ae/create-quasar-script.js'
import utils from '../lib/utils.js'

const rootDir = mkdtempSync(join(tmpdir(), 'create-quasar-ae-'))

// silence the scaffolding progress UI in the test output
const testUtils = {
  ...utils,
  prompts: {
    ...utils.prompts,
    taskLog: () => ({ message() {}, success() {}, error() {} })
  }
}

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

const author = 'Test Author <test@example.com>'
let scaffoldCount = 0

// mirrors the scope that bin/create-quasar.js hands over to
// createProjectFolder() after parsing the CLI arguments
async function scaffold({ name = 'my-ext', ...presetFlags }) {
  const preset = Object.keys(presetFlags).filter(key => presetFlags[key])

  const projectFolderName = `ae-${++scaffoldCount}`
  const scope = {
    projectFolder: join(rootDir, projectFolderName),
    projectFolderName,
    name,
    author,
    preset,
    packageManagerList: ['pnpm', 'yarn', 'npm', 'bun'],
    meta: {}
  }

  await createQuasarScript({ scope, utils: testUtils })
  return scope
}

function readJson(scope, relativePath) {
  return JSON.parse(
    readFileSync(join(scope.projectFolder, relativePath), 'utf8')
  )
}

function has(scope, relativePath) {
  return existsSync(join(scope.projectFolder, relativePath))
}

const boolCombos = flags =>
  flags.reduce(
    (acc, flag) => acc.flatMap(combo => [combo, { ...combo, [flag]: true }]),
    [{}]
  )

const allCombos = boolCombos([
  'typescript',
  'linting',
  'prompts',
  'install',
  'uninstall'
])

const comboName = combo => {
  const flags = Object.keys(combo).filter(key => combo[key])
  return flags.length !== 0 ? flags.join('+') : 'no presets'
}

describe('[templates/ae] scaffolding', () => {
  test.each(allCombos.map(combo => [comboName(combo), combo]))(
    'renders a valid App Extension with: %s',
    async (_, combo) => {
      const scope = await scaffold(combo)
      const ext = combo.typescript ? 'ts' : 'js'

      // the monorepo root, with the "_" filename prefix stripped
      expect(has(scope, 'package.json')).toBe(true)
      expect(has(scope, '.gitignore')).toBe(true)
      expect(has(scope, '.editorconfig')).toBe(true)
      expect(has(scope, 'pnpm-workspace.yaml')).toBe(true)
      expect(has(scope, 'README.md')).toBe(true)

      const rootPkg = readJson(scope, 'package.json')
      expect(rootPkg.name).toBe('quasar-app-extension')
      expect(rootPkg.author).toBe(author)

      // the App Extension package itself
      expect(scope.aeShortName).toBe('my-ext')
      expect(scope.aeFullName).toBe('quasar-app-extension-my-ext')

      const aePkg = readJson(scope, 'ae/package.json')
      expect(aePkg.name).toBe('quasar-app-extension-my-ext')
      expect(has(scope, `ae/src/index.${ext}`)).toBe(true)

      // the playground app
      const playgroundPkg = readJson(scope, 'playground/package.json')
      expect(playgroundPkg.devDependencies['quasar-app-extension-my-ext']).toBe(
        'workspace:*'
      )
      expect(has(scope, `playground/quasar.config.${ext}`)).toBe(true)

      // optional AE scripts
      expect(has(scope, `ae/src/prompts.${ext}`)).toBe(Boolean(combo.prompts))
      expect(has(scope, `ae/src/install.${ext}`)).toBe(Boolean(combo.install))
      expect(has(scope, `ae/src/uninstall.${ext}`)).toBe(
        Boolean(combo.uninstall)
      )
      expect(aePkg.dependencies?.['@clack/prompts'] !== void 0).toBe(
        Boolean(combo.prompts)
      )

      // linting preset always resolves to oxlint for App Extensions
      expect(scope.linter).toBe(combo.linting ? 'oxlint' : void 0)

      const oxlintFiles = combo.typescript
        ? ['oxlint.config.ts', 'oxfmt.config.ts']
        : ['.oxlintrc.json', '.oxfmtrc.json']
      for (const file of oxlintFiles) {
        expect(has(scope, file)).toBe(Boolean(combo.linting))
      }
      expect(rootPkg.scripts.lint !== void 0).toBe(Boolean(combo.linting))

      // App Extensions are pnpm-only
      expect(scope.packageManagerList).toEqual(['pnpm'])
    }
  )

  test.each([
    ['my-ext', 'my-ext', 'quasar-app-extension-my-ext'],
    ['@my-org/my-ext', '@my-org/my-ext', '@my-org/quasar-app-extension-my-ext'],
    ['quasar-app-extension-my-ext', 'my-ext', 'quasar-app-extension-my-ext'],
    [
      '@my-org/quasar-app-extension-my-ext',
      '@my-org/my-ext',
      '@my-org/quasar-app-extension-my-ext'
    ]
  ])(
    'derives the AE package names from ext-id "%s"',
    async (name, aeShortName, aeFullName) => {
      const scope = await scaffold({ name, prompts: true })

      expect(scope.aeShortName).toBe(aeShortName)
      expect(scope.aeFullName).toBe(aeFullName)

      const aePkg = readJson(scope, 'ae/package.json')
      expect(aePkg.name).toBe(aeFullName)

      const readme = readFileSync(
        join(scope.projectFolder, 'README.md'),
        'utf8'
      )
      expect(readme).toContain(`Quasar App Extension "${aeShortName}"`)
    }
  )
})
