import { expect, test } from 'vitest'

import { capitalize, slugify } from './utils.js'

test('slugify turns headings into anchor ids', () => {
  expect(slugify('Hello World')).toBe('hello-world')
  expect(slugify('a & b')).toBe('a-and-b')
  expect(slugify('src/utils.date (v2) demo')).toBe('src-utils-date-v2-demo')
  expect(slugify('Multiple   spaces --- and dashes')).toBe(
    'multiple-spaces-and-dashes'
  )
})

test('capitalize uppercases the first character only', () => {
  expect(capitalize('quasar')).toBe('Quasar')
  expect(capitalize('already Capitalized')).toBe('Already Capitalized')
})
