import { expect, test } from 'vitest'

import { capitalize, slugify } from './utils.js'
import { slugify as mcpSlugify } from '../../mcp/src/slugify.js'

test('slugify turns headings into anchor ids', () => {
  expect(slugify('Hello World')).toBe('hello-world')
  expect(slugify('a & b')).toBe('a-and-b')
  expect(slugify('src/utils.date (v2) demo')).toBe('src-utils-date-v2-demo')
  expect(slugify('Multiple   spaces --- and dashes')).toBe(
    'multiple-spaces-and-dashes'
  )
  // punctuation is a dash wherever it falls, and never one at either end
  expect(slugify("Quasar's CSS")).toBe('quasar-s-css')
  expect(slugify('Dynamic (on SSR/SSG)')).toBe('dynamic-on-ssr-ssg')
  expect(slugify('/package.json')).toBe('package-json')
  expect(slugify('`Basic`')).toBe(slugify('Basic'))
})

test('slugify is the very function the MCP server resolves sections by', () => {
  // the published package cannot import this file, so it carries a copy;
  // a quasar.dev fragment has to name the same section on both sides
  expect(mcpSlugify.toString()).toBe(slugify.toString())
})

test('slugify drops the markup a title carries', () => {
  // the badge leaves a gap behind it that must not become a dash, or the
  // search index would point at an anchor no page renders
  expect(slugify('Using an Ajax filter <q-badge label="v2.4.5+" />')).toBe(
    'using-an-ajax-filter'
  )
  expect(slugify('Keyboard dismissal <q-badge label="v2.25+" />')).toBe(
    'keyboard-dismissal'
  )
  expect(slugify('  padded  ')).toBe('padded')
})

test('capitalize uppercases the first character only', () => {
  expect(capitalize('quasar')).toBe('Quasar')
  expect(capitalize('already Capitalized')).toBe('Already Capitalized')
})
