import { expect, test } from 'vitest'
import { renderProse as render } from '../test-helpers.js'

test('h1 emits #', () => {
  // Source heading levels are preserved as-is. The page title lives in the
  // frontmatter rather than being injected as an extra H1.
  expect(render('# Hello')).toBe('# Hello\n\n')
})

test('h2 emits ##', () => {
  expect(render('## Hello')).toBe('## Hello\n\n')
})

test('paragraph emits with trailing blank line', () => {
  expect(render('A line of text.')).toBe('A line of text.\n\n')
})

test('two paragraphs separated by blank line', () => {
  expect(render('First.\n\nSecond.')).toBe('First.\n\nSecond.\n\n')
})

test('text with inline content joins correctly', () => {
  expect(render('hello world')).toBe('hello world\n\n')
})
