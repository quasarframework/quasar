import { expect, test } from 'vitest'
import { renderProse as render } from '../test-helpers.js'

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

test('ordered list preserves a non-1 start number', () => {
  const output = render('5. five\n6. six')
  expect(output).toBe('5. five\n6. six\n\n')
})
