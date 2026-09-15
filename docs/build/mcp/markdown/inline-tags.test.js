import { expect, test } from 'vitest'
import { transformInlineTag } from './inline-tags.js'

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

test('q-btn with href and label becomes a link paragraph', () => {
  expect(
    transformInlineTag(
      '<q-btn icon-right="launch" label="Layout Builder" href="/layout-builder" target="_blank" />',
      { siteUrl: null }
    )
  ).toBe('[Layout Builder](/layout-builder)\n\n')
})

test('q-btn link is absolutized in a package slice', () => {
  expect(
    transformInlineTag(
      '<q-btn label="Layout Builder" href="/layout-builder" />',
      {
        siteUrl: 'https://quasar.dev'
      }
    )
  ).toBe('[Layout Builder](https://quasar.dev/layout-builder)\n\n')
})

test('q-btn without an href is dropped', () => {
  expect(transformInlineTag('<q-btn label="Trigger All" />')).toBe('')
})
