import { expect, test } from 'vitest'
import { existsSync } from 'node:fs'
import { join, normalize } from 'node:path'

import { quasarElements } from './links.components.js'

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
