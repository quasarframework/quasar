import { expect, test } from 'vitest'
import { createAiMd } from './md-ai.js'

test('createAiMd returns a markdown-it instance with html enabled', () => {
  const md = createAiMd()
  expect(typeof md.parse === 'function').toBeTruthy()
  const tokens = md.parse('# hello\n<DocApi file="QKnob" />\n', {})
  expect(tokens.some(({ type }) => type === 'heading_open')).toBeTruthy()
  expect(
    tokens.some(
      ({ type, content }) =>
        type === 'html_block' && content.startsWith('<DocApi')
    )
  ).toBeTruthy()
})

test('createAiMd registers container parsing', () => {
  const md = createAiMd()
  const tokens = md.parse('::: tip\nhi\n:::', {})
  expect(tokens.some(({ type }) => type === 'container_tip_open')).toBeTruthy()
})

test('createAiMd disables typographer (no smart quote substitution)', () => {
  const md = createAiMd()
  const tokens = md.parse("track's value", {})
  const text = tokens
    .filter(({ type }) => type === 'inline')
    .flatMap(({ children }) => children)
    .filter(({ type }) => type === 'text')
    .map(({ content }) => content)
    .join('')
  expect(
    text,
    `should preserve straight apostrophe; got: ${JSON.stringify(text)}`
  ).toContain("track's")
})
