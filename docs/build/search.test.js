import { expect, test } from 'vitest'
import { spawnSync } from 'node:child_process'
import { globSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const docsDir = join(import.meta.dirname, '..')

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
  const pagesDir = join(docsDir, 'src/pages')
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
