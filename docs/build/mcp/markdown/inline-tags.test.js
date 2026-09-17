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
  const ctx = { siteUrl: null, warnings: [], sourcePath: 'layout/page.md' }
  expect(
    transformInlineTag(
      '<q-btn icon-right="launch" label="Layout Builder" href="/layout-builder" target="_blank" />',
      ctx
    )
  ).toBe('[Layout Builder](/layout-builder)\n\n')
  // a route of the site, not a page: the site form links it, the tool is
  // there next to the page
  expect(ctx.warnings).toEqual([])
})

test('q-btn link follows the rules of a markdown link in a package slice', () => {
  const menuPaths = new Set(['layout/grid/flex-playground', 'layout/drawer'])
  const ctx = {
    siteUrl: 'https://quasar.dev',
    menuPaths,
    pageKeys: new Set(['layout/drawer']),
    sitePages: new Set(['layout/drawer']),
    warnings: [],
    sourcePath: 'layout/grid/row.md'
  }
  // a page of the slice: relative, as a markdown link
  expect(
    transformInlineTag('<q-btn label="Drawer" to="/layout/drawer" />', ctx)
  ).toBe('[Drawer](../drawer.md)\n\n')
  expect(ctx.warnings).toEqual([])
  // a page the site form leaves out: no markdown of it exists anywhere
  expect(
    transformInlineTag(
      '<q-btn icon-right="launch" label="Flex Playground" to="/layout/grid/flex-playground" />',
      ctx
    )
  ).toBe(
    '[Flex Playground](https://quasar.dev/layout/grid/flex-playground)\n\n'
  )
  expect(ctx.warnings).toEqual([
    'Link /layout/grid/flex-playground in layout/grid/row.md (a <q-btn>) leads to a page of the site only, wrap it in <llm-exclude when="mcp" reason="...">'
  ])
})

test('q-btn without an href is dropped', () => {
  expect(transformInlineTag('<q-btn label="Trigger All" />')).toBe('')
})
