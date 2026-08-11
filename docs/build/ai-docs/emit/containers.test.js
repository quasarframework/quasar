import { expect, test } from 'vitest'
import { renderProseWithContainers as render } from '../test-helpers.js'

test('tip container becomes GH alert', () => {
  const output = render('::: tip\nHello\n:::')
  expect(output).toBe('> [!TIP]\n> Hello\n\n')
})

test('warning container', () => {
  const output = render('::: warning\nBe careful\n:::')
  expect(output).toBe('> [!WARNING]\n> Be careful\n\n')
})

test('danger container maps to CAUTION', () => {
  const output = render('::: danger\nStop\n:::')
  expect(output).toBe('> [!CAUTION]\n> Stop\n\n')
})

test('custom title is preserved in bold', () => {
  const output = render('::: warning WATCH OUT\nDangerous code\n:::')
  expect(output).toBe('> [!WARNING]\n> **WATCH OUT**\n> Dangerous code\n\n')
})

test('nested container inside blockquote stacks prefixes', () => {
  const output = render('> ::: tip\n> hello\n> :::\n')
  // Outer "> " from blockquote + inner "> " from container = "> > " on every body line.
  // After container_close, blockquote prefix remains for the trailing blank line.
  expect(output).toMatch(/> > \[!TIP\]\n> > hello/)
})

test('container nested inside another container', () => {
  const output = render('::: warning\nouter\n\n::: tip\ninner\n:::\n:::\n')
  // Inner tip lines get "> > " (both prefixes stacked)
  expect(output).toMatch(/> > \[!TIP\]/)
})

test('details container uses HTML', () => {
  const output = render('::: details Click me\nHidden\n:::')
  expect(output).toBe(
    '<details><summary>Click me</summary>\n\nHidden\n\n</details>\n\n'
  )
})

test('redundant **TIP** line right after `> [!TIP]` header is stripped', () => {
  // Authors sometimes write the explicit GFM alert AND a bold label inside;
  // the post-process pass should drop the duplicate label.
  const output = render('::: tip\n**TIP**\nDo the thing.\n:::')
  expect(output).toContain('> [!TIP]')
  expect(output).not.toContain('> **TIP**')
  expect(output).toContain('Do the thing.')
})

test('multi-paragraph tip keeps paragraph separation inside the quote', () => {
  const output = render('::: tip\npara one\n\npara two\n:::')
  expect(output).toBe('> [!TIP]\n> para one\n> \n> para two\n\n')
})
