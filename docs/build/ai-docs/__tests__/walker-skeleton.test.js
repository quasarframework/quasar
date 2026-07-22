import { expect, test } from 'vitest'

import { createCtx, emitTokens } from '../emit/walker.js'

test('emitTokens returns empty string for empty token list', () => {
  const ctx = createCtx({ sourcePath: 'x.md', frontMatter: {}, pageMenu: {} })
  expect(emitTokens([], ctx)).toBe('')
})

test('emitTokens warns and strips unknown tokens', () => {
  const ctx = createCtx({ sourcePath: 'x.md', frontMatter: {}, pageMenu: {} })
  const tokens = [
    { type: 'totally_made_up_token', content: '', children: null }
  ]
  const output = emitTokens(tokens, ctx)
  expect(output).toBe('')
  expect(ctx.warnings.length).toBe(1)
  expect(ctx.warnings[0]).toMatch(/totally_made_up_token/)
})

test('createCtx initializes prefix stack and warnings as empty', () => {
  const ctx = createCtx({ sourcePath: 'x.md', frontMatter: {}, pageMenu: {} })
  expect(ctx.prefixStack).toStrictEqual([])
  expect(ctx.warnings).toStrictEqual([])
  expect(ctx.sourcePath).toBe('x.md')
})
