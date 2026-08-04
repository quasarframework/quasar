import { describe, expect, test } from 'vitest'

import {
  areVariablesDefinitionsOnly,
  createScssTransform
} from '../../../src/scss-transform.js'

const quasarImport = "'quasar/src/css/variables.sass'"

describe('scss transform', () => {
  test('quasar variables file qualifies as definitions-only', () => {
    expect(areVariablesDefinitionsOnly(true)).toBe(true)
  })

  test('unreadable custom variables file disables the skip fast path', () => {
    expect(areVariablesDefinitionsOnly('/definitely/not/a/file.sass')).toBe(
      false
    )
  })

  test('scss injection does not shift line numbers', () => {
    const transform = createScssTransform('scss', true)
    const content = '.foo {\n  color: $primary;\n}\n'
    const result = transform(content)

    expect(result).toContain(`@import ${quasarImport};`)
    expect(result.split('\n').length).toBe(content.split('\n').length)
  })

  test('sass injection shifts line numbers by exactly one', () => {
    const transform = createScssTransform('sass', 'src/my-vars.sass')
    const content = '.foo\n  color: $primary\n'
    const result = transform(content)

    expect(result).toContain(`@import 'src/my-vars.sass', ${quasarImport}\n`)
    expect(result.split('\n').length).toBe(content.split('\n').length + 1)
  })

  test('injects after @use statements', () => {
    const transform = createScssTransform('scss', true)
    const content = "@use 'sass:math';\n.foo { width: math.div($x, 2); }\n"
    const result = transform(content)

    expect(
      result.startsWith(`@use 'sass:math';\n@import ${quasarImport};.foo`)
    ).toBe(true)
  })

  test('skips injection when content cannot use variables', () => {
    const transform = createScssTransform('scss', true, true)
    const content = '.foo {\n  color: red;\n}\n'

    expect(transform(content)).toBe(content)
  })

  test('still injects for content loading other files when skipping is allowed', () => {
    const transform = createScssTransform('sass', true, true)
    // no "$" here, but the imported file may use the injected variables
    const content = "@import './core/toolbar'\n"

    expect(transform(content)).toContain(`@import ${quasarImport}\n`)
  })

  test('still injects for variable-using content when skipping is allowed', () => {
    const transform = createScssTransform('scss', true, true)
    const content = '.foo { color: $primary; }\n'

    expect(transform(content)).toContain(`@import ${quasarImport};`)
  })

  test('always injects when skipping is not allowed', () => {
    const transform = createScssTransform('scss', true, false)
    const content = '.foo { color: red; }\n'

    expect(transform(content)).toContain(`@import ${quasarImport};`)
  })
})
