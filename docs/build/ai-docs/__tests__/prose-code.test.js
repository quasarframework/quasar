import { expect, test } from 'vitest'
import { renderProse as render } from './helpers.js'

test('fenced js code block', () => {
  const output = render('```js\nconst x = 1\n```')
  expect(output).toBe('```js\nconst x = 1\n```\n\n')
})

test('fenced block with no language', () => {
  const output = render('```\nplain\n```')
  expect(output).toBe('```\nplain\n```\n\n')
})

test('fence info with attrs and title (Quasar codeblock syntax) keeps only the language', () => {
  // Quasar format: ```js [numbered] My Title
  const output = render('```js [numbered] My Title\nconst x = 1\n```')
  expect(output).toBe('```js\nconst x = 1\n```\n\n')
})

test('indented code block', () => {
  const output = render('    indented\n    code')
  expect(output).toBe('```\nindented\ncode\n```\n\n')
})

test('code containing triple backticks gets a longer output fence', () => {
  const output = render('````md\n```js\nconst x = 1\n```\n````')
  expect(output).toBe('````md\n```js\nconst x = 1\n```\n````\n\n')
})
