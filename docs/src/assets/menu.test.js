import { expect, test } from 'vitest'
import { existsSync } from 'node:fs'
import { join, normalize } from 'node:path'

import menu from './menu.js'

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
