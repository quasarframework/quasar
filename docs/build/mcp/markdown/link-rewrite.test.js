import { expect, test } from 'vitest'
import { resolveMenuKey, rewriteLink } from './link-rewrite.js'

const menuPaths = new Set([
  'vue-components/knob',
  'vue-components/circular-progress',
  'vue-composables/use-quasar'
])

test('in-tree path matching menu becomes relative .md', () => {
  expect(rewriteLink('/vue-components/knob', menuPaths)).toBe(
    'vue-components/knob.md'
  )
})

test('in-tree path NOT in menu is left unchanged', () => {
  expect(rewriteLink('/quasar-cli-webpack/deprecated', menuPaths)).toBe(
    '/quasar-cli-webpack/deprecated'
  )
})

test('external URL unchanged', () => {
  expect(rewriteLink('https://example.com', menuPaths)).toBe(
    'https://example.com'
  )
})

test('mailto unchanged', () => {
  expect(rewriteLink('mailto:x@y.z', menuPaths)).toBe('mailto:x@y.z')
})

test('in-page anchor unchanged', () => {
  expect(rewriteLink('#section', menuPaths)).toBe('#section')
})

test('relative path unchanged', () => {
  expect(rewriteLink('relative/path.md', menuPaths)).toBe('relative/path.md')
})

test('in-tree path with trailing slash', () => {
  expect(rewriteLink('/vue-components/knob/', menuPaths)).toBe(
    'vue-components/knob.md'
  )
})

test('in-tree path with fragment', () => {
  expect(rewriteLink('/vue-components/knob#size', menuPaths)).toBe(
    'vue-components/knob.md#size'
  )
})

test('in-tree path with query string', () => {
  expect(rewriteLink('/vue-components/knob?foo=bar', menuPaths)).toBe(
    'vue-components/knob.md?foo=bar'
  )
})

test('in-tree path with query AND fragment', () => {
  expect(rewriteLink('/vue-components/knob?foo=bar#size', menuPaths)).toBe(
    'vue-components/knob.md?foo=bar#size'
  )
})

test('root-only path falls back to {root}/introduction when that exists', () => {
  // Authors sometimes link to a bare section root (`/quasar-plugins`).
  // The convention is to land on the section's introduction page.
  const paths = new Set(['quasar-plugins/introduction', 'vue-components/knob'])
  expect(rewriteLink('/quasar-plugins', paths)).toBe(
    'quasar-plugins/introduction.md'
  )
})

test('root-only path without matching introduction stays unchanged', () => {
  const paths = new Set(['vue-components/knob'])
  expect(rewriteLink('/no-such-section', paths)).toBe('/no-such-section')
})

test('root-only path with fragment preserved through introduction fallback', () => {
  const paths = new Set(['quasar-plugins/introduction'])
  expect(rewriteLink('/quasar-plugins#install', paths)).toBe(
    'quasar-plugins/introduction.md#install'
  )
})

test('in-tree link from a nested output page resolves relative to it', () => {
  const output = rewriteLink(
    '/vue-composables/use-quasar',
    menuPaths,
    'vue-components/knob.md'
  )
  expect(output).toBe('../vue-composables/use-quasar.md')
})

test('in-tree link to a sibling page stays in the same directory', () => {
  const output = rewriteLink(
    '/vue-components/circular-progress',
    menuPaths,
    'vue-components/knob.md'
  )
  expect(output).toBe('circular-progress.md')
})

test('resolveMenuKey names the menu page behind an in-tree href, query and fragment set aside', () => {
  expect(
    resolveMenuKey('/vue-components/knob?x=1#usage', menuPaths)
  ).toStrictEqual({
    key: 'vue-components/knob',
    query: '?x=1',
    fragment: '#usage'
  })
  expect(resolveMenuKey('/nowhere', menuPaths)).toBe(null)
  expect(
    resolveMenuKey('https://quasar.dev/vue-components/knob', menuPaths)
  ).toBe(null)
})

const sliceRun = {
  pageKeys: new Set(['vue-components/knob']),
  siteUrl: 'https://quasar.dev'
}

test('a page the run writes stays a relative .md link', () => {
  expect(
    rewriteLink(
      '/vue-components/knob#usage',
      menuPaths,
      'vue-components/circular-progress.md',
      sliceRun
    )
  ).toBe('knob.md#usage')
})

test('a menu page outside a slice points at the live site', () => {
  expect(
    rewriteLink(
      '/vue-composables/use-quasar?x=1#y',
      menuPaths,
      'vue-components/knob.md',
      sliceRun
    )
  ).toBe('https://quasar.dev/vue-composables/use-quasar?x=1#y')
})

test('a menu page outside the site run keeps its root-relative href', () => {
  expect(
    rewriteLink(
      '/vue-composables/use-quasar',
      menuPaths,
      'vue-components/knob.md',
      {
        pageKeys: sliceRun.pageKeys
      }
    )
  ).toBe('/vue-composables/use-quasar')
})

test('a href matching no menu page is untouched whatever the run', () => {
  expect(rewriteLink('/layout-builder', menuPaths, 'x.md', sliceRun)).toBe(
    '/layout-builder'
  )
})
