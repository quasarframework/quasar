import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'vitest'
import { globSync } from 'tinyglobby'
import matter from 'gray-matter'

import { IGNORES } from './generate.js'
import { buildMenuMaps } from './pages/menu.js'
import { sourceToMenuKey } from './pages/routes.js'

const pagesDir = join(import.meta.dirname, '../../src/pages')

// The "view as Markdown" button and the <head> link point at the .md
// sibling the site form writes. A page that form leaves out has to say
// `mdLink: false`, and only such a page may.
test('a page links its markdown sibling exactly when the site form writes one', () => {
  const menuByKey = buildMenuMaps(pagesDir)
  const written = new Set(
    globSync('**/*.md', { cwd: pagesDir, ignore: IGNORES }).filter(
      rel => menuByKey.get(sourceToMenuKey(rel))?.llm.site === true
    )
  )
  const wrong = globSync('**/*.md', { cwd: pagesDir }).filter(rel => {
    const { data } = matter(readFileSync(join(pagesDir, rel), 'utf8'))
    return (data.mdLink !== false) !== written.has(rel)
  })
  expect(
    wrong,
    'set `mdLink: false` on a page with no .md sibling, and nowhere else'
  ).toEqual([])
})
