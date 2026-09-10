import { expect, test } from 'vitest'
import { existsSync } from 'node:fs'
import { join, normalize } from 'node:path'

import { quasarElements } from './links.components.js'
import menu from './menu.js'

const pagesDir = normalize(join(import.meta.dirname, '../pages'))
const publicDir = normalize(join(import.meta.dirname, '../../public'))

test('every catalog entry links to an existing page', () => {
  expect(quasarElements.length).toBeGreaterThan(0)

  for (const entry of quasarElements) {
    // pages are either <path>.md or folder-based <path>/<leaf>.md,
    // like the menu (see /docs/build/md/flat-menu.js)
    const leaf = entry.to.slice(entry.to.lastIndexOf('/') + 1)

    expect(
      existsSync(join(pagesDir, `${entry.to}.md`)) ||
        existsSync(join(pagesDir, entry.to, `${leaf}.md`)),
      `catalog entry "${entry.name}" points at a missing page (${entry.to})`
    ).toBe(true)
  }
})

test('every component catalog image exists', () => {
  const withImages = quasarElements.filter(entry => entry.img !== void 0)
  expect(withImages.length).toBeGreaterThan(0)

  for (const entry of withImages) {
    expect(
      existsSync(join(publicDir, entry.img)),
      `catalog entry "${entry.name}" references a missing image (${entry.img})`
    ).toBe(true)
  }
})

test('catalog targets are unique', () => {
  const targets = quasarElements.map(entry => `${entry.category}${entry.to}`)
  expect(new Set(targets).size).toBe(targets.length)
})

// the catalog mirrors the five menu sections it draws from; a page
// added to one of them (see ./menu.js) must get a catalog card too
const catalogSections = [
  'vue-components',
  'vue-directives',
  'quasar-plugins',
  'vue-composables',
  'quasar-utils'
]

const menuPaths = new Set()
const catalogSectionPaths = []

function walk(node, path, section) {
  const newPath = path + (node.path ? `/${node.path}` : '')

  if (node.children !== void 0) {
    node.children.forEach(child => {
      walk(child, newPath, section ?? node.path)
    })
  } else if (!node.external) {
    menuPaths.add(newPath)

    if (catalogSections.includes(section)) {
      catalogSectionPaths.push({ name: node.name, path: newPath })
    }
  }
}

menu.forEach(node => {
  walk(node, '', null)
})

test('every page of the catalog menu sections has a catalog entry', () => {
  expect(catalogSectionPaths.length).toBeGreaterThan(0)

  const catalogTargets = new Set(quasarElements.map(entry => entry.to))

  const missing = catalogSectionPaths
    .filter(({ path }) => !catalogTargets.has(path))
    .map(({ name, path }) => `${name} (${path})`)

  expect(missing, 'menu pages without a catalog entry').toEqual([])
})

test('every catalog entry is reachable from the menu', () => {
  const orphans = quasarElements
    .filter(entry => !menuPaths.has(entry.to))
    .map(entry => `${entry.name} (${entry.to})`)

  expect(orphans, 'catalog entries missing from the menu').toEqual([])
})
