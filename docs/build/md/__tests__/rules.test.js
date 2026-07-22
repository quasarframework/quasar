import { expect, test } from 'vitest'
import markdownIt from 'markdown-it'
import { registerAllParsing, sharedMdOptions } from '../md-rules.js'

test('sharedMdOptions matches the live site config', () => {
  expect(sharedMdOptions).toStrictEqual({
    html: true,
    linkify: false,
    typographer: true
  })
})

test('registerAllParsing registers container parsing rules', () => {
  const md = markdownIt(sharedMdOptions)
  registerAllParsing(md)
  const tokens = md.parse('::: tip\nhi\n:::', {})
  expect(tokens.some(({ type }) => type === 'container_tip_open')).toBeTruthy()
})
