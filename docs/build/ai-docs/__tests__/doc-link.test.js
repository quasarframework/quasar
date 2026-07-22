import { expect, test } from 'vitest'
import { docLinkHandler } from '../emit/doc-link.js'

test('self-closing DocLink falls back to the last path segment as label', () => {
  const handler = docLinkHandler()
  const token = { content: '<DocLink to="/vue-components/knob" />' }
  const ctx = { warnings: [], sourcePath: 't.md' }
  // doc-link returns the rewritten link. link-rewrite handles the .md mapping.
  const output = handler.inline(token, ctx)
  expect(output).toBe('[knob](/vue-components/knob)')
})

test('paired DocLink uses the target as label (children arrive as separate tokens)', () => {
  const handler = docLinkHandler()
  // markdown-it splits the paired form into open/text/close tokens, so the
  // handler only sees the open tag. DocLink is unused in source today, this
  // documents the defensive fallback.
  const token = { content: '<DocLink to="/vue-components/knob">' }
  const ctx = { warnings: [], sourcePath: 't.md' }
  const output = handler.inline(token, ctx)
  expect(output).toBe('[/vue-components/knob](/vue-components/knob)')
})

test('missing to attribute emits nothing and warns', () => {
  const handler = docLinkHandler()
  const token = { content: '<DocLink />' }
  const ctx = { warnings: [], sourcePath: 't.md' }
  expect(handler.inline(token, ctx)).toBe('')
  expect(ctx.warnings.length).toBe(1)
  expect(ctx.warnings[0]).toMatch(/missing to=/)
})
