import { expect, test } from 'vitest'
import { countTokens } from '../tokens.js'

test('countTokens returns a positive number for non-empty input', () => {
  const tokenCount = countTokens('Hello world, this is a sample.')
  expect(tokenCount > 0).toBeTruthy()
})

test('countTokens returns 0 for empty string', () => {
  expect(countTokens('')).toBe(0)
})

test('countTokens is roughly proportional to length', () => {
  const short = countTokens('hi')
  const long = countTokens('hi '.repeat(100))
  expect(long > short * 10).toBeTruthy()
})
