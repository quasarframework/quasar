import { expect, test } from 'vitest'
import { transformInlineTag } from '../emit/inline-tags.js'

test('q-badge becomes italic version note', () => {
  expect(transformInlineTag('<q-badge label="v2.5.4+" />')).toBe('*(v2.5.4+)*')
})

test('q-badge with no label is dropped', () => {
  expect(transformInlineTag('<q-badge />')).toBe('')
})

test('q-icon is dropped', () => {
  expect(transformInlineTag('<q-icon name="check" />')).toBe('')
})

test('unknown tag returns null (caller logs warning)', () => {
  expect(transformInlineTag('<q-rocket />')).toBe(null)
})

test('non-q tag returns null', () => {
  expect(transformInlineTag('<SomeComponent />')).toBe(null)
})

test('liveDocsStub links to the live page of the source being extracted', () => {
  const ctx = { sourcePath: 'style/typography.md' }
  const output = transformInlineTag('<TypographyHeadings />', ctx)
  expect(output).toContain('https://v2.quasar.dev/style/typography')
})

test('liveDocsStub applies the dir-collapse rule to the page path', () => {
  const ctx = { sourcePath: 'vue-components/menu/menu.md' }
  const output = transformInlineTag('<TransitionList />', ctx)
  expect(output).toContain('https://v2.quasar.dev/vue-components/menu')
})

test('liveDocsStub falls back to the site root without a source path', () => {
  const output = transformInlineTag('<TransitionList />')
  expect(output).toContain('(https://v2.quasar.dev)')
})
