import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { expect, onTestFinished, test } from 'vitest'

import {
  DOCS_FORMAT,
  extractSection,
  listHeadings,
  loadDocs,
  matchedSections,
  normalizeRoute,
  readPage,
  searchDocs,
  similarRoutes
} from './docs.js'
import { loadProject } from './project.js'
import { createProject } from './test/fixture.js'

function load(opts) {
  return loadDocs(loadProject(createProject(opts)).packages)
}

/**
 * Docs of the given pages alone, written to a throwaway directory.
 *
 * @param {Record<string, { title: string, desc?: string, keys?: string[], body?: string }>} pages Keyed by route.
 * @returns {import('./docs.js').Docs}
 */
function docsOf(pages) {
  const dir = mkdtempSync(join(tmpdir(), 'quasar-mcp-docs-'))
  onTestFinished(() => {
    rmSync(dir, { recursive: true, force: true })
  })
  const docs = { pages: new Map(), sources: [], unreadable: [] }
  for (const [
    route,
    { title, desc = null, keys = [], body = '' }
  ] of Object.entries(pages)) {
    const file = join(dir, `${route}.md`)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, `---\ntitle: ${title}\n---\n\n${body}\n`)
    docs.pages.set(route, {
      route,
      title,
      desc,
      keys,
      packageName: 'quasar',
      file
    })
  }
  return docs
}

const routes = hits => hits.map(hit => hit.page.route)

test('indexes every slice, serving a page both ship once', () => {
  const docs = load()
  expect(docs.sources).toEqual([
    { name: 'quasar', version: '2.33.0', pageCount: 3 },
    { name: '@quasar/app-vite', version: '3.9.0', pageCount: 1 }
  ])
  expect(docs.pages.get('start/ai-agents').packageName).toBe('quasar')
  expect(readPage(docs.pages.get('start/ai-agents'))).toContain(
    'Shipped by quasar.'
  )
})

test('skips a package whose release bundles no docs', () => {
  const docs = load({ quasarDocs: false })
  expect(docs.sources.map(source => source.name)).toEqual(['@quasar/app-vite'])
})

test('normalizes the ways an agent may spell a route', () => {
  for (const input of [
    'vue-components/button',
    '/vue-components/button',
    'vue-components/button.md',
    '../vue-components/button.md',
    'https://quasar.dev/vue-components/button#usage',
    'https://v2.quasar.dev/vue-components/button/',
    '  vue-components/button  '
  ]) {
    expect(normalizeRoute(input), input).toBe('vue-components/button')
  }
})

test('lists headings, ignoring fenced code', () => {
  const docs = load()
  const headings = listHeadings(
    readPage(docs.pages.get('vue-components/button'))
  )
  expect(headings).toEqual([
    { level: 2, text: 'QBtn API' },
    { level: 2, text: 'Usage' },
    { level: 3, text: 'Standard' },
    { level: 3, text: 'Custom colors' },
    { level: 2, text: 'Loading state' }
  ])
})

test('extracts a section up to the next heading of its level', () => {
  const docs = load()
  const markdown = readPage(docs.pages.get('vue-components/button'))

  const usage = extractSection(markdown, 'Usage')
  expect(usage.startsWith('## Usage')).toBe(true)
  expect(usage).toContain('### Custom colors')
  expect(usage).not.toContain('## Loading state')

  const custom = extractSection(markdown, 'custom-colors')
  expect(custom).toBe(
    '### Custom colors\n\nUse the `color` prop. See also [Notify](../quasar-plugins/notify.md).'
  )
  expect(extractSection(markdown, 'Loading state')).toContain('spinner')
  expect(extractSection(markdown, 'Nope')).toBeNull()
})

test('search ranks the page about the subject first and needs every term', () => {
  const docs = load()

  const [first] = searchDocs(docs, 'button')
  expect(first.page.route).toBe('vue-components/button')
  expect(first.sections).toEqual([])

  expect(routes(searchDocs(docs, 'notify'))).toEqual([
    'quasar-plugins/notify',
    'vue-components/button'
  ])
  expect(routes(searchDocs(docs, 'boot file'))).toEqual([
    'quasar-cli-vite/boot-files'
  ])
  expect(searchDocs(docs, 'button unicorn')).toEqual([])
  expect(
    searchDocs(docs, 'button', { packageName: '@quasar/app-vite' })
  ).toEqual([])
  expect(searchDocs(docs, 'a', { limit: 1 })).toEqual([])
})

test('a term matches a word, its plural or singular, or the start of a longer one', () => {
  const docs = docsOf({
    'vue-components/tabs': { title: 'Tabs', body: 'A tab strip.' },
    'vue-components/tab-panels': {
      title: 'Tab Panels',
      body: 'Panels for tabs.'
    },
    'vue-components/table': {
      title: 'Table',
      body: 'A table has tabular data.'
    }
  })
  // "tab" is Tabs (plural), then Tab Panels (one word of two), then
  // Table (the start of a word), never part of "tabular"
  expect(routes(searchDocs(docs, 'tab'))).toEqual([
    'vue-components/tabs',
    'vue-components/tab-panels',
    'vue-components/table'
  ])
  expect(routes(searchDocs(docs, 'tabs'))).toEqual([
    'vue-components/tabs',
    'vue-components/tab-panels'
  ])
  expect(routes(searchDocs(docs, 'tabu'))).toEqual(['vue-components/table'])
  expect(searchDocs(docs, 'abl')).toEqual([])
  // a plural query finds the singular title
  expect(routes(searchDocs(docs, 'tables'))).toEqual(['vue-components/table'])
})

test('a term in most pages weighs little, one in few decides', () => {
  const docs = docsOf({
    'start/how-to-use-vue': {
      title: 'How to use Vue',
      body: 'How to use Vue. Notify is a plugin.'
    },
    'quasar-plugins/notify': {
      title: 'Notify',
      body: 'How to use Notify: call it. Notify again.'
    },
    'vue-components/button': {
      title: 'Button',
      body: 'How to use a button. Notify the user.'
    }
  })
  expect(routes(searchDocs(docs, 'how to use notify'))).toEqual([
    'quasar-plugins/notify',
    'start/how-to-use-vue',
    'vue-components/button'
  ])
})

test('a page is found by the names it documents, as tag, component or key', () => {
  const docs = docsOf({
    'vue-components/button': {
      title: 'Button',
      keys: ['QBtn'],
      body: 'A button. Set loading for a spinner.\n\n## Loading state\n\nA spinner.'
    },
    'quasar-plugins/loading': {
      title: 'Loading',
      keys: ['Loading'],
      body: 'Loading overlays. Loading again. A <q-btn> shows it.'
    },
    'vue-directives/touch-pan': {
      title: 'v-touch-pan directive',
      keys: ['touch-pan', 'v-touch-pan'],
      body: 'Pan gestures.\n\n## TouchPan API\n\nSee get_api.'
    },
    'vue-composables/use-meta': {
      title: 'useMeta composable',
      keys: ['useMeta'],
      body: 'Meta tags.'
    },
    // a slice predating keys: the API heading names the subject
    'vue-components/tabs': {
      title: 'Tabs',
      body: '## QTabs API\n\nSee get_api.'
    }
  })
  for (const query of ['QBtn', 'q-btn', 'qbtn']) {
    expect(routes(searchDocs(docs, query)), query).toEqual([
      'vue-components/button',
      'quasar-plugins/loading'
    ])
  }
  // the subject plus a heading beats the subject plus a mention
  expect(routes(searchDocs(docs, 'q-btn loading'))).toEqual([
    'vue-components/button',
    'quasar-plugins/loading'
  ])
  for (const query of ['v-touch-pan', 'touch-pan', 'TouchPan', 'touchpan']) {
    expect(routes(searchDocs(docs, query)), query).toEqual([
      'vue-directives/touch-pan'
    ])
  }
  expect(routes(searchDocs(docs, 'use-meta'))).toEqual([
    'vue-composables/use-meta'
  ])
  expect(routes(searchDocs(docs, 'q-tabs'))).toEqual(['vue-components/tabs'])
})

test('punctuation around a term does not count, inside an identifier it does', () => {
  const docs = docsOf({
    'quasar-plugins/notify': {
      title: 'Notify',
      body: 'Call $q.notify() with vue.config.js loaded.'
    }
  })
  for (const query of [
    'notify.',
    'notify,',
    '(notify)',
    '$q.notify',
    'vue.config'
  ]) {
    expect(routes(searchDocs(docs, query)), query).toEqual([
      'quasar-plugins/notify'
    ])
  }
  expect(searchDocs(docs, '. -')).toEqual([])
})

test('the page about the subject outranks a long page mentioning it, ties go to mentions', () => {
  const docs = docsOf({
    'vue-components/knob': { title: 'Knob', body: 'A knob.' },
    'vue-components/range': {
      title: 'Range',
      desc: 'A knob.',
      body: 'Knob, knob.'
    },
    'vue-components/dial': { title: 'Dial', desc: 'A knob.', body: 'Knob.' },
    'vue-components/slider': {
      title: 'Slider',
      body: 'The knob turns. '.repeat(200)
    },
    'vue-components/gauge': {
      title: 'Gauge',
      body: 'The knob turns. '.repeat(100)
    }
  })
  // the description outranks any number of mentions; past the cap the
  // mentions only break the tie (Slider over Gauge, against the route order)
  expect(routes(searchDocs(docs, 'knob'))).toEqual([
    'vue-components/knob',
    'vue-components/range',
    'vue-components/dial',
    'vue-components/slider',
    'vue-components/gauge'
  ])
})

test('suggests routes resembling a miss', () => {
  const docs = load()
  expect(similarRoutes(docs, 'components/button')).toEqual([
    'vue-components/button'
  ])
  expect(similarRoutes(docs, 'nothing/here')).toEqual([])
})

test('a miss in a section nothing serves gets no look-alike from elsewhere', () => {
  const docs = load({ appVite: false })
  expect(similarRoutes(docs, 'quasar-cli-vite/boot-files')).toEqual([])
  // a wrong section still finds the page of that exact name
  expect(similarRoutes(docs, 'quasar-cli-vite/button')).toEqual([
    'vue-components/button'
  ])
  // inside a served section the match stays loose
  expect(similarRoutes(docs, 'vue-components/buttons')).toEqual([
    'vue-components/button'
  ])
})

test('a hit names the sections its terms occur under, the one most about the query first', () => {
  const docs = load()
  const [hit] = searchDocs(docs, 'loading')
  expect(hit.page.route).toBe('vue-components/button')
  expect(hit.sections).toEqual(['Loading state'])

  const body = [
    '---',
    'title: T',
    'desc: prop prop prop',
    '---',
    '',
    'prop before any heading',
    '',
    '## Usage',
    '',
    'one prop',
    '',
    '### Standard',
    '',
    '```vue',
    '<x prop="a" :prop="b" />',
    '## prop inside a fence is not a heading',
    '```',
    '',
    '## Props deep dive',
    '',
    'prop and prop'
  ].join('\n')
  // "Props deep dive" carries the term in its heading; "Standard" has
  // the most occurrences (the fence counts, its fake heading does not)
  expect(matchedSections(body, ['prop'])).toEqual([
    'Props deep dive',
    'Standard',
    'Usage'
  ])
  expect(matchedSections(body, ['prop'], 1)).toEqual(['Props deep dive'])
  expect(matchedSections(body, ['nothing'])).toEqual([])
  // terms match words: "tab" is Tabs first, Table (the start of a word) after
  expect(
    matchedSections('## Table\n\ntabular table\n\n## Tabs\n\ntab', ['tab'])
  ).toEqual(['Tabs', 'Table'])
  // the page's subject is in every section and weighs nothing there;
  // the query's other term marks the section
  expect(
    matchedSections(
      '## A\n\ntable table table table\n\n## B\n\ntable sorting\n\n## Sorting\n\ntable',
      ['table', 'sorting']
    )
  ).toEqual(['Sorting', 'B', 'A'])
  // a heading made of the terms beats one that merely contains them
  expect(
    matchedSections(
      '## Server side pagination, filter and sorting\n\ntable sorting table sorting table sorting\n\n## Custom sorting\n\ntable sorting table sorting\n\n## Sorting\n\ntable sorting',
      ['table', 'sorting']
    )
  ).toEqual([
    'Sorting',
    'Custom sorting',
    'Server side pagination, filter and sorting'
  ])
})

test('a slice of another format is left out and named, a slice without the field is format 1', () => {
  expect(DOCS_FORMAT).toBe(1)
  const docs = load({ docsFormat: 2 })
  expect(docs.sources.map(source => source.name)).toEqual(['@quasar/app-vite'])
  expect(docs.unreadable).toEqual([
    { name: 'quasar', version: '2.33.0', format: 2 }
  ])
  expect(docs.pages.has('vue-components/button')).toBe(false)
  // the page both slices carry is still served, by the readable one
  expect(docs.pages.get('start/ai-agents').packageName).toBe('@quasar/app-vite')

  expect(load({ docsFormat: void 0 }).unreadable).toEqual([])
})
