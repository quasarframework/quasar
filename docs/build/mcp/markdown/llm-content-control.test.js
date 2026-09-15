import { expect, test } from 'vitest'
import { applyLlmContentControl } from './llm-content-control.js'

test('strips <llm-exclude> blocks', () => {
  const src = 'keep\n<llm-exclude>drop me</llm-exclude>\nkeep more'
  expect(applyLlmContentControl(src)).toBe('keep\n\nkeep more')
})

test('keeps <llm-only> content but strips the tag', () => {
  const src = 'keep\n<llm-only>llm only content</llm-only>\nkeep more'
  expect(applyLlmContentControl(src)).toBe('keep\nllm only content\nkeep more')
})

test('handles multiline content', () => {
  const src = '<llm-exclude>\nline 1\nline 2\n</llm-exclude>\nafter'
  expect(applyLlmContentControl(src)).toBe('\nafter')
})

test('handles nested gracefully (innermost wins)', () => {
  // Nested support isn't needed. Verify it doesn't crash.
  const src = '<llm-only>outer <llm-only>inner</llm-only></llm-only>'
  // Strip both <llm-only> tag wrappers, content remains
  expect(applyLlmContentControl(src)).toBe('outer inner')
})

test('<llm-exclude> with reason attribute strips wrapper and content', () => {
  const src =
    'keep\n<llm-exclude reason="redundant with JS above">drop me</llm-exclude>\nkeep more'
  expect(applyLlmContentControl(src)).toBe('keep\n\nkeep more')
})

test('<llm-only> with reason attribute strips wrapper, keeps content', () => {
  const src =
    'keep\n<llm-only reason="LLM-only hint">llm only content</llm-only>\nkeep more'
  expect(applyLlmContentControl(src)).toBe('keep\nllm only content\nkeep more')
})

test('<llm-exclude> with multiple attributes is handled', () => {
  const src =
    '<llm-exclude reason="x" data-foo="bar">drop me</llm-exclude>after'
  expect(applyLlmContentControl(src)).toBe('after')
})

test('<llm-only> with multiline content and reason attribute', () => {
  const src = '<llm-only reason="hint">\nline 1\nline 2\n</llm-only>'
  expect(applyLlmContentControl(src)).toBe('\nline 1\nline 2\n')
})
