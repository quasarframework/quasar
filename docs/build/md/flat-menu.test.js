import { expect, test, vi } from 'vitest'
import { join, normalize } from 'node:path'
import { readFileSync } from 'node:fs'
import { globSync } from 'tinyglobby'

import { convertToRelated, flatMenu } from './flat-menu.js'
import { parseFrontMatter } from './md-parse-utils.js'

const pagesDir = normalize(join(import.meta.dirname, '../../src/pages'))

test('chains prev/next reciprocally over the flattened menu', () => {
  const entries = [...new Set(Object.values(flatMenu))]
  expect(entries.length).toBeGreaterThan(0)

  for (const entry of entries) {
    if (entry.next !== void 0) {
      const target = entries.find(other => other.path === entry.next.path)
      expect(target, `next of ${entry.path}`).toBeDefined()
      expect(target.prev.path).toBe(entry.path)
    }
  }
})

test("resolves every page's related frontmatter entries", () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  try {
    for (const page of globSync('**/*.md', { cwd: pagesDir })) {
      const { data: frontMatter } = parseFrontMatter(
        readFileSync(join(pagesDir, page), 'utf8')
      )

      for (const entry of frontMatter.related ?? []) {
        const related = convertToRelated(entry, page)
        expect(related.path, `related "${entry}" of ${page}`).toBeDefined()
      }
    }

    expect(errorSpy).not.toHaveBeenCalled()
  } finally {
    errorSpy.mockRestore()
  }
})

test('reports an unknown related link and yields an empty entry', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  try {
    expect(convertToRelated('/definitely-not-a-page', 'x')).toEqual({})
    expect(errorSpy).toHaveBeenCalledOnce()
  } finally {
    errorSpy.mockRestore()
  }
})

test('refuses an unknown related link when the build is for production', () => {
  // the dead link would otherwise be published as an empty related entry
  expect(() => convertToRelated('/definitely-not-a-page', 'x', true)).toThrow(
    /wrong related link: \/definitely-not-a-page/
  )
})

test('a related link that resolves never throws, strict or not', () => {
  // flatMenu is keyed by the absolute page file; a related entry is that
  // without the pages root and without the extension
  const [key] = Object.keys(flatMenu)
  const entry = key.slice(key.indexOf('src/pages') + 'src/pages'.length, -3)

  expect(convertToRelated(entry, 'x', true).path).toBeDefined()
})
