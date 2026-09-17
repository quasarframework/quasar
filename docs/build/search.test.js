import { expect, test } from 'vitest'
import { spawnSync } from 'node:child_process'
import { globSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import menu from '../src/assets/menu.js'
import { parseFrontMatter } from './md/md-parse-utils.js'
import { slugify } from './utils.js'
import { UNLISTED_PAGES } from './unlisted-pages.js'

const docsDir = join(import.meta.dirname, '..')
const pagesDir = join(docsDir, 'src/pages')

const readEntries = () =>
  JSON.parse(readFileSync(join(docsDir, 'dist/indices.json'), 'utf8'))

const readPage = file => readFileSync(join(pagesDir, file), 'utf8')

// The generator is an entry script, so it is exercised end-to-end: it
// only writes to the gitignored dist/ folder. This is its direct
// coverage — keep it green so the build chain is not the only net.
test('generates the search index over every page', { timeout: 120_000 }, () => {
  const { status, stderr } = spawnSync('node', ['build/search.js'], {
    cwd: docsDir,
    encoding: 'utf8'
  })
  expect(status, stderr).toBe(0)

  const entries = JSON.parse(
    readFileSync(join(docsDir, 'dist/indices.json'), 'utf8')
  )

  expect(Array.isArray(entries)).toBe(true)
  // every page contributes multiple entries; a sharp drop means pages
  // stopped being indexed
  expect(entries.length).toBeGreaterThan(1000)

  for (const entry of entries.slice(0, 50)) {
    expect(entry.url).toMatch(/^\//)
  }
})

test('leaves fenced code out of the index', () => {
  const entries = JSON.parse(
    readFileSync(join(docsDir, 'dist/indices.json'), 'utf8')
  )

  // the pages fence code as ```lang, often with a title after it. Both
  // forms are code the site renders as such, so neither may reach the
  // index as prose - nor may a comment inside one pass for a heading
  const fenced = entries.filter(entry => entry.content?.includes('```'))
  expect(fenced).toEqual([])
})

test('leads to the page itself when it renders no title heading', () => {
  const entries = JSON.parse(
    readFileSync(join(docsDir, 'dist/indices.json'), 'utf8')
  )

  // DocPage only renders the id="introduction" heading when the page asks
  // for one, so a page opting out must not be pointed at it
  const headless = globSync(join(pagesDir, '**/*.md'))
    .filter(file => /^heading:\s*false\s*$/m.test(readFileSync(file, 'utf8')))
    .map(file => file.slice(pagesDir.length, -3))
    .map(path => {
      const parts = path.split('/')
      // a page named after its own folder lives at the folder's url
      return parts.at(-1) === parts.at(-2) ? parts.slice(0, -1).join('/') : path
    })

  expect(headless.length).toBeGreaterThan(0)

  for (const url of headless) {
    const pointed = entries.filter(entry => entry.url.startsWith(url + '#'))
    expect(pointed, url).toEqual([])
  }
})

test(
  'indexes what the raw HTML wraps, not the markup',
  { timeout: 120_000 },
  () => {
    const entries = JSON.parse(
      readFileSync(join(docsDir, 'dist/indices.json'), 'utf8')
    )

    // a hand-written tag's layout attributes are not something a reader
    // searches for (pages do discuss attributes such as alt as prose, so
    // this one is picked for carrying no meaning outside of markup)
    const withAttrs = entries.filter(entry => entry.content?.includes('style='))
    expect(withAttrs).toEqual([])

    // ... and neither are the component tags the pages are built from
    const withComponents = entries.filter(entry =>
      /<Doc[A-Z]/.test(entry.content || '')
    )
    expect(withComponents).toEqual([])

    // inline code is content, though: a page documenting an HTML tag has
    // to stay findable by that tag
    const inlineCode = entries.filter(entry =>
      entry.content?.includes('<img src="./logo.png">')
    )
    expect(inlineCode.length).toBeGreaterThan(0)
  }
)

test('drops the alert markers and keeps the titles the pages wrote', () => {
  const entries = readEntries()

  // the marker line is what makes a blockquote an alert; it is not prose
  const marked = entries.filter(entry =>
    /\[![A-Z]+\]/.test(entry.content || '')
  )
  expect(marked).toEqual([])

  // a bold-only paragraph right after the marker is the alert's title, and
  // the page's own words at that; the default labels (TIP, WARNING) are not
  const titled = globSync(join(pagesDir, '**/*.md'))
    .filter(file => !UNLISTED_PAGES.includes(file.slice(pagesDir.length + 1)))
    .map(file => ({
      file,
      title: /^> \[!\w+\]\n> \*\*([^*\n]+)\*\*$/m.exec(
        readFileSync(file, 'utf8')
      )?.[1]
    }))
    .find(page => page.title !== void 0)
  expect(titled).toBeDefined()

  const url = titled.file.slice(pagesDir.length, -3)
  const withTitle = entries.filter(
    entry => entry.url.startsWith(url) && entry.content?.includes(titled.title)
  )
  expect(withTitle.length).toBeGreaterThan(0)
})

test('closes the nested sections when a shallower heading opens', () => {
  const entries = readEntries()

  // a page whose ### is followed by a ## : the outline is the source of
  // truth for what each heading's breadcrumb has to be
  const file = 'how-to-contribute/commit-conventions.md'
  const url = '/' + file.slice(0, -3)
  const outline = []
  let levels = []
  for (const [, hashes, text] of readPage(file).matchAll(/^(#{2,6}) (.+)$/gm)) {
    const rank = hashes.length - 1
    levels = [...levels.slice(0, rank - 1), text]
    outline.push({ anchor: slugify(text), levels: [...levels] })
  }
  expect(
    outline.some(
      (h, i) => i > 0 && h.levels.length < outline[i - 1].levels.length
    )
  ).toBe(true)

  for (const heading of outline) {
    const entry = entries.find(e => e.url === `${url}#${heading.anchor}`)
    expect(entry, heading.anchor).toBeDefined()
    const found = [
      entry.l1,
      entry.l2,
      entry.l3,
      entry.l4,
      entry.l5,
      entry.l6
    ].filter(l => l !== void 0)
    expect(found, heading.anchor).toEqual(heading.levels)
  }
})

test('carries the nav labels, and the title where it says more', () => {
  const entries = readEntries()

  // the breadcrumb is what the nav says, not what the folders are called
  const group = menu.find(node => node.children !== void 0)
  const leaf = group.children.find(node => node.children === void 0)
  const url = `/${group.path}/${leaf.path}`
  const entry = entries.find(e => e.url === `${url}#introduction`)
  expect(entry, url).toBeDefined()
  expect(entry.menu).toEqual([group.name, leaf.name])

  // the title rides only the page's own entry, and only when the nav's
  // leaf does not already say it: anywhere else it doubles the breadcrumb
  const titled = entries.filter(e => e.title !== void 0)
  expect(titled.length).toBeGreaterThan(0)
  for (const e of titled) {
    expect(e.url, e.title).toMatch(/#introduction$/)
    expect(e.type, e.title).toBe('page-link')
    expect(e.l1, e.title).toBeUndefined()
    expect(e.title).not.toBe(e.menu.at(-1))
  }

  const page = parseFrontMatter(readPage(`${group.path}/${leaf.path}.md`))
  expect(entry.title).toBe(
    page.data.title === leaf.name ? void 0 : page.data.title
  )
})

test('indexes the example cards under their heading', () => {
  const entries = readEntries()

  const file = 'vue-components/button.md'
  const url = '/' + file.slice(0, -3)
  const cards = []
  let heading = ''
  for (const line of readPage(file).split('\n')) {
    const h = /^#{2,6} (.+)$/.exec(line)
    if (h !== null) {
      heading = h[1]
      continue
    }
    const attrs = /^<DocExample\b([^>]*)>/.exec(line)?.[1]
    if (attrs === void 0) continue
    const title = /\btitle="([^"]*)"/.exec(attrs)[1]
    const src = /\bfile="([^"]*)"/.exec(attrs)[1]
    cards.push({
      title,
      heading,
      anchor: `example--${src.toLowerCase()}--${slugify(title)}`
    })
  }
  expect(cards.length).toBeGreaterThan(0)

  for (const card of cards) {
    const entry = entries.find(e => e.url === `${url}#${card.anchor}`)

    // an example named after the heading it sits under would only double
    // that heading's entry
    if (card.title.toLowerCase() === card.heading.toLowerCase()) {
      expect(entry, card.anchor).toBeUndefined()
      continue
    }

    expect(entry, card.anchor).toBeDefined()
    const levels = [
      entry.l1,
      entry.l2,
      entry.l3,
      entry.l4,
      entry.l5,
      entry.l6
    ].filter(l => l !== void 0)
    expect(levels.at(-1)).toBe(card.title)
    expect(levels.at(-2)).toBe(card.heading)
    expect(entry.content).toBeUndefined()
  }
})
