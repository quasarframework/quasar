import { expect, test } from 'vitest'

import {
  hasSiteMarkdown,
  headerLlmScopes,
  menuLlmScopes,
  navLlmScopes,
  pageRoute
} from './nav-forms.js'

const both = { site: true, mcp: true }
const none = { site: false, mcp: false }

test('a page is in both markdown forms unless the menu says otherwise', () => {
  const scopes = menuLlmScopes([
    { name: 'Plain', path: 'plain' },
    { name: 'Off', path: 'off', llmExclude: true },
    { name: 'No slice', path: 'no-slice', llmExclude: 'mcp' },
    { name: 'No sibling', path: 'no-sibling', llmExclude: 'site' },
    { name: 'Slice only', path: 'slice-only', llmOnly: 'mcp' },
    { name: 'Sibling only', path: 'sibling-only', llmOnly: 'site' },
    { name: 'Unset', path: 'unset', llmExclude: false, llmOnly: false },
    { name: 'Elsewhere', path: 'https://example.com', external: true }
  ])
  expect(Object.fromEntries(scopes)).toEqual({
    plain: both,
    off: none,
    'no-slice': { site: true, mcp: false },
    'no-sibling': { site: false, mcp: true },
    'slice-only': { site: false, mcp: true },
    'sibling-only': { site: true, mcp: false },
    unset: both
  })
})

test('a group flag covers its pages and a deeper flag has the last word', () => {
  const scopes = menuLlmScopes([
    {
      name: 'Group',
      path: 'group',
      llmExclude: true,
      children: [
        { name: 'Inherits', path: 'inherits' },
        { name: 'Back in', path: 'back-in', llmOnly: true },
        { name: 'Slice only', path: 'slice-only', llmOnly: 'mcp' },
        {
          name: 'Nested',
          path: 'nested',
          llmOnly: true,
          children: [{ name: 'Deep', path: 'deep', llmExclude: 'site' }]
        }
      ]
    }
  ])
  expect(Object.fromEntries(scopes)).toEqual({
    'group/inherits': none,
    'group/back-in': both,
    'group/slice-only': { site: false, mcp: true },
    'group/nested/deep': { site: false, mcp: true }
  })
})

test('a value the flags do not take names its entry', () => {
  expect(() =>
    menuLlmScopes([{ name: 'Typo', path: 'typo', llmExclude: 'mpc' }])
  ).toThrow('llmExclude of "Typo" is "mpc"')
  expect(() =>
    menuLlmScopes([
      { name: 'Both', path: 'both', llmExclude: 'mcp', llmOnly: 'site' }
    ])
  ).toThrow('"Both" sets both llmExclude and llmOnly')
})

test('header links are pages by their absolute path, groups included', () => {
  const scopes = headerLlmScopes([
    { name: 'Docs', path: '/docs', llmExclude: true },
    { name: 'Blog', path: 'https://blog.quasar.dev', external: true },
    { name: 'Builder', path: '/layout-builder', external: true },
    {
      name: 'Tools',
      llmExclude: 'mcp',
      children: [
        { name: 'Dark Mode', path: '/style/dark-mode#usage' },
        { name: 'Gallery', path: '/layout/gallery/', llmOnly: true }
      ]
    }
  ])
  expect(Object.fromEntries(scopes)).toEqual({
    docs: none,
    'style/dark-mode': { site: true, mcp: false },
    'layout/gallery': both
  })
})

test('the sidebar decides for a page both navigations list', () => {
  const menu = [{ name: 'Gallery', path: 'gallery', llmExclude: true }]
  expect(
    Object.fromEntries(navLlmScopes(menu, [{ name: 'G', path: '/gallery' }]))
  ).toEqual({ gallery: none })
  expect(() =>
    navLlmScopes(menu, [{ name: 'G', path: '/gallery', llmExclude: 'mcp' }])
  ).toThrow('/gallery is on the sidebar menu too')
})

test('a page source maps to its route, and to whether it has a .md sibling', () => {
  expect(pageRoute('/x/docs/src/pages/vue-components/button.md')).toBe(
    'vue-components/button'
  )
  expect(pageRoute('layout/layout/layout.md')).toBe('layout/layout')

  expect(hasSiteMarkdown('vue-components/button.md')).toBe(true)
  expect(hasSiteMarkdown('/x/docs/src/pages/why-donate.md')).toBe(false)
  expect(hasSiteMarkdown('docs/docs.md')).toBe(false)
  expect(hasSiteMarkdown('guide.md')).toBe(false)
})
