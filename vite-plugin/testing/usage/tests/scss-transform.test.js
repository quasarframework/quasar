import { describe, expect, test } from 'vitest'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  symlinkSync,
  utimesSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  areVariablesDefinitionsOnly,
  createScssTransform,
  createVariablesManager
} from '../../../src/scss-transform.js'

const tmpDir = mkdtempSync(join(tmpdir(), 'quasar-scss-'))
const quasarImport = "'quasar/src/css/variables.sass'"

function makeTransform(fileExtension, sassVariables) {
  const manager = createVariablesManager(sassVariables)
  return createScssTransform(fileExtension, sassVariables, manager)
}

function closureFileOf(code) {
  const match = /@import '([^']+vars-[a-f0-9]+\.scss)'/.exec(code)
  return match === null ? null : readFileSync(match[1], 'utf8')
}

describe('scss transform', () => {
  test('quasar variables qualify as definitions-only via the precomputed parse', () => {
    expect(areVariablesDefinitionsOnly(true)).toBe(true)
  })

  test('unreadable custom variables file disables the fast paths', () => {
    expect(areVariablesDefinitionsOnly('/definitely/not/a/file.sass')).toBe(
      false
    )
  })

  test('full scss injection does not shift line numbers', () => {
    // an unreadable custom file forces full injection
    const transform = makeTransform('scss', '/nope/vars.sass')
    const content = '.foo {\n  color: red;\n}\n'
    const result = transform(content, 'test.scss')

    expect(result.code).toContain(`@import '/nope/vars.sass', ${quasarImport};`)
    expect(result.code.split('\n').length).toBe(content.split('\n').length)
    expect(result.map).toBe(null)
  })

  test('full sass injection shifts lines by exactly one and provides a map', () => {
    const transform = makeTransform('sass', '/nope/vars.sass')
    const content = '.foo\n  color: red\n'
    const result = transform(content, 'test.sass')

    expect(result.code.split('\n').length).toBe(content.split('\n').length + 1)
    expect(result.map.mappings).toBe(';AAAA;AACA;AACA')
    expect(result.map.sources).toStrictEqual(['test.sass'])
  })

  test('injects after @use statements', () => {
    const transform = makeTransform('scss', '/nope/vars.sass')
    const content = "@use 'sass:math';\n.foo { width: math.div(4, 2); }\n"
    const result = transform(content, 'test.scss')

    expect(
      result.code.startsWith("@use 'sass:math';\n@import '/nope/vars.sass'")
    ).toBe(true)
  })

  test('skips injection when content cannot use variables', () => {
    const transform = makeTransform('scss', true)
    expect(transform('.foo {\n  color: red;\n}\n', 'test.scss')).toBe(null)
  })

  test('still injects for content loading other files', () => {
    const transform = makeTransform('sass', true)
    const result = transform("@import './core/toolbar'\n", 'test.sass')

    expect(result.code).toContain(`@import ${quasarImport}\n`)
  })

  test('targeted injection imports a closure file, zero scss line shift', () => {
    const transform = makeTransform('scss', true)
    const content = '.foo { padding: $flex-gutter-sm; }\n'
    const result = transform(content, 'test.scss')

    expect(result.code.split('\n').length).toBe(content.split('\n').length)
    expect(result.map).toBe(null)

    const closure = closureFileOf(result.code)
    expect(closure).toContain('$space-base:')
    expect(closure).toContain('$flex-gutter-sm:')
    expect(closure).not.toContain('@use')
  })

  test('targeted injection for sass shifts by exactly one line, mapped', () => {
    const transform = makeTransform('sass', true)
    const content = '.foo\n  padding: $flex-gutter-sm\n'
    const result = transform(content, 'test.sass')

    expect(result.code.split('\n').length).toBe(content.split('\n').length + 1)
    expect(result.map.mappings).toBe(';AAAA;AACA;AACA')
  })

  test('namespaced closures work even when content has its own @use', () => {
    const transform = makeTransform('scss', true)
    const result = transform(
      "@use 'sass:math';\n@media (min-width: $breakpoint-sm-min) { .foo { color: red; } }\n",
      'test.scss'
    )

    const closure = closureFileOf(result.code)
    expect(closure).toContain("@use 'sass:map';")
    expect(closure).toContain('$sizes:')
  })

  test('returns null when only local variables are used', () => {
    const transform = makeTransform('scss', true)
    expect(
      transform('$local: 4px;\n.foo { padding: $local; }\n', 'test.scss')
    ).toBe(null)
  })

  test('picks up edits to the custom variables file without a restart', () => {
    const varsFile = join(tmpDir, 'editable.sass')
    writeFileSync(varsFile, '$primary: #111111\n')

    const transform = makeTransform('scss', varsFile)
    const content = '.foo { color: $primary; }\n'

    const first = closureFileOf(transform(content, 'test.scss').code)
    expect(first).toContain('#111111')

    // same byte length AND identical mtime: only content-hash based
    // change detection can catch this
    const { mtime, atime } = statSync(varsFile)
    writeFileSync(varsFile, '$primary: #222222\n')
    utimesSync(varsFile, atime, mtime)

    const second = closureFileOf(transform(content, 'test.scss').code)
    expect(second).toContain('#222222')
  })

  test('watches the real path of a symlinked variables file', () => {
    const target = join(tmpDir, 'real-vars.sass')
    const link = join(tmpDir, 'linked-vars.sass')
    writeFileSync(target, '$primary: #333333\n')
    symlinkSync(target, link)

    const transform = makeTransform('scss', link)
    const watched = []
    transform('.foo { color: $primary; }\n', 'test.scss', {
      addWatchFile: file => watched.push(file)
    })

    expect(watched).toContain(link)
    expect(watched).toContain(realpathSync(target))
  })

  test('recovers after the cache dir is wiped mid-session', () => {
    const manager = createVariablesManager(true)
    const cacheRoot = mkdtempSync(join(tmpdir(), 'quasar-cache-root-'))
    mkdirSync(join(cacheRoot, 'node_modules'), { recursive: true })
    manager.setCacheRoot(cacheRoot)

    const transform = createScssTransform('scss', true, manager)
    const content = '.foo { color: $primary; }\n'

    const first = transform(content, 'test.scss')
    expect(closureFileOf(first.code)).toContain('$primary:')

    // simulate a node_modules reinstall wiping the cache dir
    rmSync(join(cacheRoot, 'node_modules'), { recursive: true, force: true })
    mkdirSync(join(cacheRoot, 'node_modules'), { recursive: true })

    const second = transform(content, 'test.scss')
    // first attempt after the wipe falls back to full injection...
    expect(second.code).toContain(`@import ${quasarImport};`)
    // ...and the one after recovers the targeted fast path
    const third = transform(content, 'test.scss')
    expect(closureFileOf(third.code)).toContain('$primary:')
  })

  test('leaves no temporary files behind', () => {
    const manager = createVariablesManager(true)
    const cacheRoot = mkdtempSync(join(tmpdir(), 'quasar-cache-root-'))
    mkdirSync(join(cacheRoot, 'node_modules'), { recursive: true })
    manager.setCacheRoot(cacheRoot)

    const transform = createScssTransform('scss', true, manager)
    transform('.foo { padding: $space-base; }\n', 'test.scss')

    const cacheDir = join(
      cacheRoot,
      'node_modules',
      '.cache',
      'quasar-vite-plugin'
    )
    const files = readdirSync(cacheDir)
    expect(files.length).toBeGreaterThan(0)
    expect(files.some(f => f.endsWith('.tmp'))).toBe(false)
  })
})
