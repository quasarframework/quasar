import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { createQuasarScript } from '../templates/app/create-quasar-script.js'
import utils from '../lib/utils.js'

const templatesDir = join(import.meta.dirname, '../templates/app/vite-3')

const rootDir = mkdtempSync(join(tmpdir(), 'create-quasar-app-'))

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
async function scaffold({ linter, ...presetFlags }) {
  const preset = Object.keys(presetFlags).filter(key => presetFlags[key])
  if (linter) preset.push('linting')

  const projectFolderName = `app-${++scaffoldCount}`
  const scope = {
    projectFolder: join(rootDir, projectFolderName),
    projectFolderName,
    name: 'test-app',
    product: 'Test App',
    author,
    preset,
    linter,
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
  'sass',
  'fbr',
  'i18n',
  'pinia'
]).flatMap(combo => [
  combo,
  { ...combo, linter: 'oxlint' },
  { ...combo, linter: 'eslint' }
])

const comboName = combo => {
  const flags = Object.entries(combo)
    .filter(([, value]) => value)
    .map(([key, value]) => (value === true ? key : value))
  return flags.length !== 0 ? flags.join('+') : 'no presets'
}

describe('[templates/app] scaffolding', () => {
  test.each(allCombos.map(combo => [comboName(combo), combo]))(
    'renders a valid project with: %s',
    async (_, combo) => {
      const scope = await scaffold(combo)
      const ext = combo.typescript ? 'ts' : 'js'

      // base files, with the "_" filename prefix stripped
      expect(has(scope, 'package.json')).toBe(true)
      expect(has(scope, '.gitignore')).toBe(true)
      expect(has(scope, '.editorconfig')).toBe(true)
      expect(has(scope, '.vscode/settings.json')).toBe(true)
      expect(has(scope, 'pnpm-workspace.yaml')).toBe(true)
      expect(has(scope, 'index.html')).toBe(true)
      expect(has(scope, 'src/App.vue')).toBe(true)
      expect(has(scope, 'src/boot/.gitkeep')).toBe(true)
      expect(has(scope, `quasar.config.${ext}`)).toBe(true)
      expect(
        has(scope, combo.typescript ? 'tsconfig.json' : 'jsconfig.json')
      ).toBe(true)

      // package.json is valid JSON with the scope values applied
      const pkg = readJson(scope, 'package.json')
      expect(pkg.name).toBe('test-app')
      expect(pkg.productName).toBe('Test App')
      expect(pkg.author).toBe(author)

      // css preprocessor preset
      expect(has(scope, 'src/css/quasar.variables.scss')).toBe(
        Boolean(combo.sass)
      )
      expect(has(scope, 'src/css/app.scss')).toBe(Boolean(combo.sass))
      expect(has(scope, 'src/css/app.css')).toBe(!combo.sass)

      // i18n preset
      expect(has(scope, `src/i18n/index.${ext}`)).toBe(Boolean(combo.i18n))
      expect(has(scope, `src/boot/i18n.${ext}`)).toBe(Boolean(combo.i18n))
      expect(pkg.dependencies['vue-i18n'] !== void 0).toBe(Boolean(combo.i18n))

      // pinia preset
      expect(has(scope, `src/stores/index.${ext}`)).toBe(Boolean(combo.pinia))
      expect(pkg.dependencies.pinia !== void 0).toBe(Boolean(combo.pinia))

      // routing mode
      expect(has(scope, `src/router/index.${ext}`)).toBe(true)
      expect(has(scope, `src/router/routes.${ext}`)).toBe(!combo.fbr)
      expect(has(scope, 'src/pages/[...path].vue')).toBe(Boolean(combo.fbr))
      expect(has(scope, 'src/layouts/MainLayout.vue')).toBe(!combo.fbr)

      // linting preset
      const oxlintFiles = combo.typescript
        ? ['oxlint.config.ts', 'oxfmt.config.ts']
        : ['.oxlintrc.json', '.oxfmtrc.json']
      for (const file of oxlintFiles) {
        expect(has(scope, file)).toBe(combo.linter === 'oxlint')
      }
      expect(has(scope, 'eslint.config.js')).toBe(combo.linter === 'eslint')
      expect(has(scope, '.prettierrc.json')).toBe(combo.linter === 'eslint')

      expect(pkg.scripts.lint !== void 0).toBe(combo.linter !== void 0)
      expect(pkg.devDependencies.oxlint !== void 0).toBe(
        combo.linter === 'oxlint'
      )
      expect(pkg.devDependencies.eslint !== void 0).toBe(
        combo.linter === 'eslint'
      )

      // the dev command hint gets injected for the final "get started" note
      expect(scope.meta.runDevCmd).toBe('quasar dev')
    }
  )

  test('copies binary assets verbatim', async () => {
    const scope = await scaffold({ sass: true, linter: 'oxlint' })

    const source = readFileSync(
      join(templatesDir, 'js/BASE/public/favicon.ico')
    )
    const target = readFileSync(join(scope.projectFolder, 'public/favicon.ico'))
    expect(target.equals(source)).toBe(true)
  })

  test('renders the README with the package manager commands', async () => {
    const scope = await scaffold({ sass: true, linter: 'oxlint' })

    const readme = readFileSync(join(scope.projectFolder, 'README.md'), 'utf8')
    expect(readme).toContain('Test App')
  })
})
