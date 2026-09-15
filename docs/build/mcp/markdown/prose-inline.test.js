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

test('a root-relative image src is absolutized in a package slice only', () => {
  const src = 'See ![flex](/img/flexbox-items.svg) here.'
  expect(render(src)).toBe('See ![flex](/img/flexbox-items.svg) here.\n\n')
  expect(render(src, { siteUrl: 'https://quasar.dev' })).toBe(
    'See ![flex](https://quasar.dev/img/flexbox-items.svg) here.\n\n'
  )
})
