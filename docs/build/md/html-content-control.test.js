/**
 * Tests for the HTML pipeline's <llm-*> content-control pass.
 *
 * mdParse returns the full Vue component source as a string (template +
 * <script setup>). Asserting on substrings in that returned string is enough
 * to verify the source-level filter runs before tokenization.
 */

import { expect, test } from 'vitest'
import mdParse from './md-parse.js'

test('<llm-only> content is stripped from HTML pipeline', () => {
  const output = mdParse(
    '---\ntitle: T\n---\nbefore\n<llm-only>secret</llm-only>\nafter\n',
    'test.md'
  )
  expect(output, 'llm-only content must be removed').not.toContain('secret')
  expect(output).toContain('before')
  expect(output).toContain('after')
})

test('<llm-exclude> wrapper stripped, content kept', () => {
  const output = mdParse(
    '---\ntitle: T\n---\nbefore\n<llm-exclude>kept</llm-exclude>\nafter\n',
    'test.md'
  )
  expect(output, 'opening tag must be stripped').not.toContain('<llm-exclude>')
  expect(output, 'closing tag must be stripped').not.toContain('</llm-exclude>')
  expect(output, 'inner content must be preserved').toContain('kept')
})

test('<llm-only reason="..."> content is stripped from HTML pipeline', () => {
  const output = mdParse(
    '---\ntitle: T\n---\nbefore\n<llm-only reason="LLM-only hint">secret</llm-only>\nafter\n',
    'test.md'
  )
  expect(output, 'llm-only content must be removed').not.toContain('secret')
  expect(output, 'reason attribute must not appear in output').not.toContain(
    'reason'
  )
  expect(output).toContain('before')
  expect(output).toContain('after')
})

test('<llm-exclude reason="..."> wrapper stripped, content kept', () => {
  const output = mdParse(
    '---\ntitle: T\n---\nbefore\n<llm-exclude reason="redundant">kept</llm-exclude>\nafter\n',
    'test.md'
  )
  expect(output, 'opening tag must be stripped').not.toContain('<llm-exclude')
  expect(output, 'closing tag must be stripped').not.toContain('</llm-exclude>')
  expect(output, 'reason attribute must not leak through').not.toContain(
    'reason'
  )
  expect(output, 'inner content must be preserved').toContain('kept')
})
