import { describe, expect, test } from 'vitest'
import { mkdtempSync, readFileSync, utimesSync, writeFileSync } from 'node:fs'
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

    // a fresh mtime is required for the stat-based change detection
    writeFileSync(varsFile, '$primary: #222222\n')
    const now = Date.now() / 1000 + 10
    utimesSync(varsFile, now, now)

    const second = closureFileOf(transform(content, 'test.scss').code)
    expect(second).toContain('#222222')
  })
})
