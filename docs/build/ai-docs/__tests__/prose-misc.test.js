import { expect, test } from 'vitest'
import { renderProse as render } from './helpers.js'

test('hr emits ---', () => {
  expect(render('---')).toBe('---\n\n')
})

test('link emits markdown link', () => {
  expect(render('[label](https://example.com)')).toBe(
    '[label](https://example.com)\n\n'
  )
})

test('image emits markdown image', () => {
  expect(render('![alt](https://example.com/x.png)')).toBe(
    '![alt](https://example.com/x.png)\n\n'
  )
})

test('table emits pipe syntax', () => {
  const output = render('| a | b |\n| - | - |\n| 1 | 2 |')
  // Header + separator + body, with trailing blank
  expect(output).toBe('| a | b |\n| --- | --- |\n| 1 | 2 |\n\n')
})

test('table cell with link preserves markup inline', () => {
  const output = render(
    '| [label](https://example.com) | desc |\n| - | - |\n| body | content |'
  )
  // Should produce a table with the link intact in the header cell
  expect(output).toMatch(/\| \[label\]\(https:\/\/example\.com\) \| desc \|/)
  // The bare URL should NOT appear before the table
  expect(output).not.toContain('[](https://example.com)')
})

test('table cell with bold text preserves markup', () => {
  const output = render('| **bold** | other |\n| - | - |\n| a | b |')
  expect(output).toMatch(/\| \*\*bold\*\* \| other \|/)
})

test('table cell with escaped pipe keeps its column boundary', () => {
  // markdown-it strips the source `\|` escape during table parsing, so the
  // serializer must re-escape the literal pipe.
  const output = render('| a\\|b | c |\n| --- | --- |\n| d | e |')
  expect(output).toMatch(/\| a\\\|b \| c \|/)
})
