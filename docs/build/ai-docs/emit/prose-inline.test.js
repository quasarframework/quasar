import { expect, test } from 'vitest'
import { renderProse as render } from '../test-helpers.js'

test('strong emits **', () => {
  expect(render('A **bold** word.')).toBe('A **bold** word.\n\n')
})

test('em emits *', () => {
  expect(render('An *italic* word.')).toBe('An *italic* word.\n\n')
})

test('code_inline emits backticks', () => {
  expect(render('Use `foo()`.')).toBe('Use `foo()`.\n\n')
})

test('nested emphasis works', () => {
  expect(render('A ***bold-italic*** word.')).toBe(
    'A ***bold-italic*** word.\n\n'
  )
})

test('code_inline containing a backtick uses double-backtick wrapping with padding', () => {
  // Source markdown uses double-backtick syntax to embed a backtick in inline
  // code: `` `tpl` ``. The emitter must preserve this so renderers don't
  // misread the inner backtick as a closing delimiter.
  const output = render('Use ``a `b` c`` here.')
  expect(output).toMatch(/`` a `b` c ``/)
})
