import { expect, test } from 'vitest'
import { renderProse as render } from './helpers.js'

test('simple bullet list', () => {
  const output = render('- one\n- two\n- three')
  expect(output).toBe('- one\n- two\n- three\n\n')
})

test('simple ordered list', () => {
  const output = render('1. one\n2. two\n3. three')
  expect(output).toBe('1. one\n2. two\n3. three\n\n')
})

test('nested bullet list', () => {
  const output = render('- one\n  - nested\n  - also nested\n- two')
  expect(output).toBe('- one\n  - nested\n  - also nested\n- two\n\n')
})
