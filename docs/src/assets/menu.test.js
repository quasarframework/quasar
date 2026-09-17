import { expect, test } from 'vitest'
import { existsSync, globSync } from 'node:fs'
import { join, normalize } from 'node:path'

import menu from './menu.js'
import { buildMenuMaps } from '../../build/mcp/pages/menu.js'
import { sourceToMenuKey } from '../../build/mcp/pages/routes.js'
import { UNLISTED_PAGES } from '../../build/unlisted-pages.js'

const pagesDir = normalize(join(import.meta.dirname, '../pages'))

// mirror of the flat-menu walk: a leaf maps to <path>.md or the
// folder-based <path>/<leaf>.md
const leaves = []

function walk(node, path) {
  const newPath = path + (node.path ? `/${node.path}` : '')

  if (node.children !== void 0) {
    node.children.forEach(child => {
      walk(child, newPath)
    })
  } else if (!node.external) {
    leaves.push({ name: node.name, path: newPath, leaf: node.path })
  } else {
    // externals are either full URLs or absolute in-app routes
    // (Vue pages outside the markdown tree, e.g. /layout-builder)
    expect(node.path, `external "${node.name}"`).toMatch(/^(https?:\/\/|\/)/)
  }
}

menu.forEach(node => {
  walk(node, '')
})

test('every menu leaf resolves to an existing markdown page', () => {
  expect(leaves.length).toBeGreaterThan(0)

  for (const { name, path, leaf } of leaves) {
    const pageForm = join(pagesDir, `${path}.md`)
    const folderForm = join(pagesDir, path, `${leaf}.md`)

    expect(
      existsSync(pageForm) || existsSync(folderForm),
      `menu entry "${name}" (${path}) has no markdown page`
    ).toBe(true)
  }
})

test('menu paths are unique', () => {
  const paths = leaves.map(({ path }) => path)
  expect(new Set(paths).size).toBe(paths.length)
})

// the inverse: a page nobody can navigate to is a page nobody reads, and
// the AI-docs export (which selects pages by the navigation) skips it too.
// The pages meant to be reached by URL alone are named, one by one, in
// build/unlisted-pages.js.
test('every markdown page is on the sidebar menu or in the header links', () => {
  const navKeys = buildMenuMaps(pagesDir)
  const orphans = globSync('**/*.md', { cwd: pagesDir }).filter(
    rel => !UNLISTED_PAGES.includes(rel) && !navKeys.has(sourceToMenuKey(rel))
  )

  expect(
    orphans,
    'pages on no navigation: add each to menu.js (or links.header.js), or delete it'
  ).toStrictEqual([])
})
