import { expect, test } from 'vitest'
import { renderProse as render } from './helpers.js'

test('simple blockquote', () => {
  expect(render('> hello\n')).toBe('> hello\n\n')
})

test('blockquote with multiple lines', () => {
  expect(render('> line one\n> line two\n')).toBe('> line one\n> line two\n\n')
})

test('plain `> Note` blockquote upgrades to GFM [!NOTE] alert', () => {
  const output = render('> Note that something happens here.\n')
  expect(output).toContain('> [!NOTE]')
  expect(output).toContain('> that something happens here.')
  // The original `Note ` prefix is gone after upgrade.
  expect(output).not.toContain('> Note that')
})

test('plain `> Important:` blockquote upgrades to GFM [!IMPORTANT] alert', () => {
  const output = render('> Important: read this carefully.\n')
  expect(output).toContain('> [!IMPORTANT]')
  expect(output).toContain('read this carefully.')
})

test('plain `> Hello` blockquote (unrecognised prefix) stays a plain blockquote', () => {
  const output = render('> Hello world.\n')
  expect(output).not.toContain('[!')
  expect(output).toContain('> Hello world.')
})

test('multi-paragraph blockquote keeps a quoted separator line', () => {
  const output = render('> para one\n>\n> para two')
  expect(output).toBe('> para one\n> \n> para two\n\n')
})
