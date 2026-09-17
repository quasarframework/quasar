/**
 * Tests for the HTML pipeline's <llm-*> content-control pass.
 *
 * mdParse returns the full Vue component source as a string (template +
 * <script setup>). Asserting on substrings in that returned string is enough
 * to verify the source-level filter runs before tokenization.
 */

import { expect, test } from 'vitest'
import mdParse, { applyHtmlContentControl } from './md-parse.js'

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

test('<llm-only> leaves behind the lines it occupied', () => {
  // markdown-it numbers a heading by the lines it is handed, so swallowing
  // these would report every heading below the block above where it is
  const source = 'a\n<llm-only reason="r">\nx\ny\n</llm-only>\nb\n'
  const output = applyHtmlContentControl(source)

  expect(output).not.toContain('x')
  expect(output.split('\n')).toHaveLength(source.split('\n').length)
})

test('a tag inside a code fence is code, shown as written', () => {
  const output = mdParse(
    '---\ntitle: T\n---\n```html\n<llm-only when="mcp">shown</llm-only>\n```\n',
    'test.md'
  )
  expect(output).toContain('llm-only when=')
  expect(output).toContain('shown')
})

test('a tag without its reason, or with an attribute it does not take, throws', () => {
  expect(() => applyHtmlContentControl('<llm-only>x</llm-only>')).toThrow(
    '<llm-only> needs a reason'
  )
  expect(() =>
    applyHtmlContentControl('<llm-exclude reason="r" mcp>x</llm-exclude>')
  ).toThrow('Unknown attribute "mcp"')
})
