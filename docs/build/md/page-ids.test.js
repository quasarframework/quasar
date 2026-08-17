import { expect, test, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import mdParse from './md-parse.js'
import {
  collectPageIds,
  findPageIdIssues,
  formatPageIdIssues,
  reportPageIdIssues
} from './page-ids.js'
import { renderAllPages, renderPage } from './test-helpers.js'

const docsDir = join(import.meta.dirname, '../..')

function issuesOf(content, frontMatter) {
  const { html, frontMatter: rendered } = renderPage(content, frontMatter)

  return findPageIdIssues(html, rendered)
}

const pages = renderAllPages().map(({ rel, html, frontMatter }) => ({
  rel,
  ...findPageIdIssues(html, frontMatter)
}))

test('the pages exist to be swept', () => {
  // a glob that silently matched nothing would make every sweep below pass
  expect(pages.length).toBeGreaterThan(250)
})

test('a page never puts the same id on two elements', () => {
  const offenders = pages.flatMap(({ rel, duplicates }) =>
    duplicates.map(entry => `${rel}: ${entry}`)
  )

  expect(offenders).toEqual([])
})

test('every TOC entry points at an id the page renders', () => {
  const offenders = pages.flatMap(({ rel, orphanTocEntries }) =>
    orphanTocEntries.map(id => `${rel}: ${id}`)
  )

  expect(offenders).toEqual([])
})

// One reproduction per shape a collision comes in, pinning what the detector
// says about it. Deliberately not written as "this must never happen": ids
// are made unique by naming the pages well, not by the pipeline renumbering
// them, so a fixture demanding otherwise would sit red forever and say
// nothing. What has to hold is that a page doing it is still seen - which is
// what lets the sweeps above mean something when they come back empty.

test('two headings that read alike are seen taking one id', () => {
  const { html, frontMatter } = renderPage(
    '## Capgo\n\n### Installation\n\n## Capawesome\n\n### Installation'
  )
  const { duplicates } = findPageIdIssues(html, frontMatter)

  // said once: the TOC handing v-for this same key twice follows from it, and
  // is not reported separately
  expect(duplicates).toEqual([
    'heading "Installation" on line 7 takes the id "installation", already' +
      ' taken by heading "Installation" on line 3' +
      ' - a link to #installation only ever reaches line 3'
  ])

  // the TOC collects exactly the h2/h3 this fixture renders, so it has to
  // name them in the same order: were one side ever renumbered alone, the
  // TOC would start pointing at ids the page does not render
  expect(frontMatter.toc.map(entry => entry.id)).toEqual(
    collectPageIds(html, frontMatter)
      .filter(entry => entry.source === 'heading')
      .map(entry => entry.id)
  )
})

test('a heading is seen taking the layout h1 id', () => {
  // no page writes "## Introduction" today; DocPage's own h1 already owns it,
  // and being the layout's it sits in no file and so has no line to give
  expect(issuesOf('## Introduction').duplicates).toEqual([
    'heading "Introduction" on line 1 takes the id "introduction", already' +
      ' taken by DocPage h1' +
      ' - a link to #introduction only ever reaches the first'
  ])
})

test('two examples that read alike are seen taking one id', () => {
  // DocCardTitle and DocInstall take a title and no id, computing
  // slugify(title) in the browser: the md stage cannot pull two of them
  // apart, it can only say so
  const { duplicates } = issuesOf(
    '<DocExample title="Basic" file="Same" />\n\n' +
      '<DocExample title="Basic" file="Same" />'
  )

  // no lines: these ids are the components' to build, and the markdown only
  // hands over the attributes they build them from
  expect(duplicates).toEqual([
    'DocExample "Basic" takes the id "example--same--basic", already taken by' +
      ' DocExample "Basic"' +
      ' - a link to #example--same--basic only ever reaches the first',
    'DocExample source "Same" takes the id "example-src--same", already taken' +
      ' by DocExample source "Same"' +
      ' - a link to #example-src--same only ever reaches the first'
  ])
})

test('an id a page wrote by hand is named after its tag, not called a heading', () => {
  // flex-playground.md puts one on a demo component; the report has to say so
  // rather than blame a heading the page never wrote
  const ids = collectPageIds(
    '<h2 id="demo"></h2><FlexPlaygroundDemo id="demo" />',
    { heading: false }
  )

  expect(ids).toEqual([
    { id: 'demo', source: 'heading' },
    { id: 'demo', source: '<FlexPlaygroundDemo>' }
  ])
})

// What a page author is told, in the terminal and on the page itself. Both
// are driven with markup written by hand rather than by the pipeline: they
// have to keep saying this no matter how the pipeline stops colliding.

function captureReport(html, frontMatter, pageId) {
  const lines = []
  const spy = vi
    .spyOn(console, 'error')
    .mockImplementation((...args) => lines.push(args.join(' ')))

  reportPageIdIssues(formatPageIdIssues(html, frontMatter), pageId)
  spy.mockRestore()

  return lines
}

test('the dev server names the page, the id and both claimants', () => {
  const lines = captureReport(
    '<h2 id="usage"></h2><h2 id="usage"></h2>',
    { heading: false, toc: [] },
    '/src/pages/some/page.md'
  )

  expect(lines).toHaveLength(1)
  // the tag, then the page as the author would type it - Vite hands over an
  // absolute path, which is neither
  expect(lines[0]).toContain('[page-ids] src/pages/some/page.md')
  expect(lines[0]).toContain('id "usage"')
  expect(lines[0]).toContain('heading takes the id "usage", already taken by')
})

test('the dev server reports a TOC entry the page never renders', () => {
  const lines = captureReport(
    '<h2 id="usage"></h2>',
    { heading: false, toc: [{ id: 'usage-2' }] },
    '/src/pages/some/page.md'
  )

  expect(lines).toHaveLength(1)
  expect(lines[0]).toContain('usage-2')
})

test('the dev server stays quiet on a page whose ids are unique', () => {
  const lines = captureReport(
    '<h2 id="usage"></h2><h2 id="config"></h2>',
    { heading: false, toc: [{ id: 'usage' }, { id: 'config' }] },
    '/src/pages/some/page.md'
  )

  expect(lines).toEqual([])
})

// mdParse also writes to the console, which is not what these are about
function parsePage(source, isProd) {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
  const sfc = mdParse(source, 'src/pages/some/page.md', isProd)
  spy.mockRestore()

  return sfc
}

const COLLIDING_PAGE = '---\ntitle: T\n---\n## Usage\n\n## Usage\n'
const idIssuesRE = /^const idIssues = (\[.*\])$/m

test('the page carries its own collisions in dev', () => {
  const sfc = parsePage(COLLIDING_PAGE, false)

  expect(sfc).toContain(':id-issues="idIssues"')

  const declaration = idIssuesRE.exec(sfc)
  expect(declaration, 'idIssues must be declared for the binding').not.toBe(
    null
  )

  // the page is handed the same sentences the terminal was given - and the
  // lines are the file's, not the body's: the two headings sit on lines 4 and
  // 6 of COLLIDING_PAGE, three lines below where markdown-it counts them
  expect(JSON.parse(declaration[1])).toEqual([
    'heading "Usage" on line 6 takes the id "usage", already taken by' +
      ' heading "Usage" on line 4' +
      ' - a link to #usage only ever reaches line 4'
  ])
})

test('a stripped <llm-only> block does not move the lines below it', () => {
  // the two headings sit on lines 11 and 13 of this page; everything the
  // block holds belongs to the AI export and never reaches markdown-it
  const sfc = parsePage(
    '---\ntitle: T\n---\n\nIntro.\n<llm-only>\nfor the AI export\n' +
      'and more\n</llm-only>\n\n## Usage\n\n## Usage\n',
    false
  )

  expect(JSON.parse(idIssuesRE.exec(sfc)[1])).toEqual([
    'heading "Usage" on line 13 takes the id "usage", already taken by' +
      ' heading "Usage" on line 11' +
      ' - a link to #usage only ever reaches line 11'
  ])
})

test('a page whose ids are unique carries no banner', () => {
  const sfc = parsePage('---\ntitle: T\n---\n## Usage\n\n## Config\n', false)

  expect(sfc).not.toContain('id-issues')
  expect(sfc).not.toContain('idIssues')
})

test('a production build refuses to publish a page that collides', () => {
  // md-vite-plugin hands this to `this.error`, which is the build failing
  expect(() => parsePage(COLLIDING_PAGE, true)).toThrow(
    /\[page-ids\] src\/pages\/some\/page\.md/
  )
  // and it says what is wrong, not merely that something is
  expect(() => parsePage(COLLIDING_PAGE, true)).toThrow(
    /heading "Usage" on line 6 takes the id "usage"/
  )
})

test('a production build of a sound page carries none of it', () => {
  const sfc = parsePage('---\ntitle: T\n---\n## Usage\n\n## Config\n', true)

  expect(sfc).not.toContain('id-issues')
  expect(sfc).not.toContain('idIssues')
})

test('what the pipeline emits is a prop DocPage declares', () => {
  const docPage = readFileSync(
    join(docsDir, 'src/layouts/doc-layout/DocPage.vue'),
    'utf8'
  )

  // the generator writes `:id-issues`, which Vue hands to this prop; without
  // the declaration it would land in the fall-through attrs instead
  expect(docPage).toContain('idIssues: Array')

  // reported, never rendered: the article in dev has to stay the article
  // production serves
  expect(docPage).toContain('import.meta.env.QUASAR_DEV')
  expect(docPage).toMatch(
    /console\.error\(`\[page-ids\] \$\{location\.pathname\} - \$\{issue\}`\)/
  )
  expect(docPage).toContain('Notify.create(')
  expect(docPage, 'the toast waits to be dismissed').toContain('timeout: 0')
  expect(docPage, 'no id issue may reach the template').not.toMatch(
    /<[^>]*props\.idIssues/
  )
})

test('the id shapes mirrored in page-ids.js still live in their components', () => {
  const read = rel => readFileSync(join(docsDir, rel), 'utf8')

  // DocCardTitle owns the slug; its callers vary only the prefix
  expect(read('src/components/DocCardTitle.vue')).toContain(
    "(props.prefix || '') + slugify(props.title)"
  )
  expect(read('src/layouts/doc-layout/DocPage.vue')).toContain(
    'id="introduction"'
  )
  // DocExample folds the file into the prefix, which is what keeps two
  // examples sharing a title apart
  expect(read('src/components/DocExample.vue')).toMatch(
    /titlePrefix = computed\(\(\) => `example--\$\{props\.file\.toLowerCase\(\)\}--`\)/
  )
  expect(read('src/components/DocExample.vue')).toContain('example-src--')
  // both of those ids are built from the file, so it cannot be optional
  expect(read('src/components/DocExample.vue')).toMatch(
    /file: \{\s*type: String,\s*required: true/
  )
  // the pen's "Forked from" anchor is built from that same prefix, so it
  // cannot drift into linking at an id no page renders
  expect(read('src/components/DocCodepen.vue')).toContain(
    "(props.prefix || '') + slugify(props.title)"
  )
  expect(read('src/components/DocInstall.vue')).toContain(
    "default: 'Installation'"
  )
  expect(read('src/components/DocApi.vue')).toMatch(
    /nameBanner\.value = `\$\{name\} API`/
  )
})
