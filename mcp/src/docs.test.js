import { expect, test } from 'vitest'

import {
  extractSection,
  listHeadings,
  loadDocs,
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

test('search ranks title matches first and needs every term', () => {
  const docs = load()

  const [first] = searchDocs(docs, 'button')
  expect(first.page.route).toBe('vue-components/button')
  expect(first.snippet).toContain('QBtn')

  expect(searchDocs(docs, 'notify').map(hit => hit.page.route)).toEqual([
    'quasar-plugins/notify',
    'vue-components/button'
  ])
  expect(searchDocs(docs, 'boot file').map(hit => hit.page.route)).toEqual([
    'quasar-cli-vite/boot-files'
  ])
  expect(searchDocs(docs, 'button unicorn')).toEqual([])
  expect(
    searchDocs(docs, 'button', { packageName: '@quasar/app-vite' })
  ).toEqual([])
  expect(searchDocs(docs, 'a', { limit: 1 })).toEqual([])
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
