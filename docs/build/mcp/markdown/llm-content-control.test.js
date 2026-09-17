import { expect, test } from 'vitest'
import { applyLlmContentControl as apply } from './llm-content-control.js'

const applyLlmContentControl = source => apply(source, 'site')

test('strips <llm-exclude> blocks', () => {
  const src = 'keep\n<llm-exclude reason="r">drop me</llm-exclude>\nkeep more'
  expect(applyLlmContentControl(src)).toBe('keep\n\nkeep more')
})

test('keeps <llm-only> content but strips the tag', () => {
  const src =
    'keep\n<llm-only reason="r">llm only content</llm-only>\nkeep more'
  expect(applyLlmContentControl(src)).toBe('keep\nllm only content\nkeep more')
})

test('handles multiline content', () => {
  const excluded =
    '<llm-exclude reason="r">\nline 1\nline 2\n</llm-exclude>\nafter'
  expect(applyLlmContentControl(excluded)).toBe('\nafter')
  const only = '<llm-only reason="hint">\nline 1\nline 2\n</llm-only>'
  expect(applyLlmContentControl(only)).toBe('\nline 1\nline 2\n')
})

test('a tag narrowed to one form applies there alone', () => {
  const src = [
    'a',
    '<llm-exclude when="mcp" reason="the package ships it">dump</llm-exclude>',
    '<llm-only when="mcp" reason="r">pointer</llm-only>',
    '<llm-exclude reason="not for the site form" when="site">slice only</llm-exclude>',
    '<llm-only when="site" reason="r">site only</llm-only>',
    '<llm-exclude reason="r">never</llm-exclude>',
    '<llm-only reason="r">always</llm-only>',
    'z'
  ].join('\n')
  expect(apply(src, 'site')).toBe('a\ndump\n\n\nsite only\n\nalways\nz')
  expect(apply(src, 'mcp')).toBe('a\n\npointer\nslice only\n\n\nalways\nz')
  expect(() => apply(src, 'html')).toThrow('Unknown markdown form')
})

test('a tag that would silently do something else fails the build', () => {
  for (const [src, message] of [
    ['<llm-exclude>x</llm-exclude>', '<llm-exclude> needs a reason'],
    ['<llm-only reason=" ">x</llm-only>', '<llm-only> needs a reason'],
    [
      '<llm-exclude reason="r" when="mpc">x</llm-exclude>',
      'Unknown value when="mpc"'
    ],
    [
      '<llm-exclude reason="r" type="mcp">x</llm-exclude>',
      'Unknown attribute "type"'
    ],
    ['<llm-only mcp reason="r">x</llm-only>', 'Unknown attribute "mcp"'],
    ['<llm-only reason>x</llm-only>', 'Attribute "reason" on <llm-only>'],
    [
      '<llm-only reason="r">outer <llm-only reason="r">inner</llm-only></llm-only>',
      '<llm-only> is left over'
    ],
    ['<llm-exclude reason="r">never closed', '<llm-exclude> is left over']
  ]) {
    expect(() => apply(src, 'mcp'), src).toThrow(message)
  }
  // the words inside the reason are not attributes
  expect(
    apply('<llm-exclude reason="when on mcp, type=x">x</llm-exclude>', 'site')
  ).toBe('')
})

test('a tag inside code, fenced or inline, is code', () => {
  expect(apply('the `<llm-only>` tag and `</llm-exclude>`', 'site')).toBe(
    'the `<llm-only>` tag and `</llm-exclude>`'
  )
  const src = [
    '<llm-only reason="r">',
    '```html',
    '<llm-exclude when="mcp">shown as written</llm-exclude>',
    '```',
    '</llm-only>',
    '~~~~',
    '```',
    '</llm-only>',
    '~~~~',
    '<llm-exclude reason="r">dropped</llm-exclude>'
  ].join('\n')
  expect(apply(src, 'mcp')).toBe(
    [
      '',
      '```html',
      '<llm-exclude when="mcp">shown as written</llm-exclude>',
      '```',
      '',
      '~~~~',
      '```',
      '</llm-only>',
      '~~~~',
      ''
    ].join('\n')
  )
})
