import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { expect, onTestFinished, test, vi } from 'vitest'

import { loadProject } from './project.js'
import { createServer } from './server.js'
import { createProject } from './test/fixture.js'
import { version } from './version.js'

const noUpdates = () => Promise.resolve([])

/**
 * @param {{ fixture?: object, checkUpdates?: Function }} [opts]
 * @returns {Promise<Client>}
 */
async function connect({ fixture, checkUpdates = noUpdates } = {}) {
  const project = loadProject(createProject(fixture))
  const server = await createServer({ project, checkUpdates })
  const client = new Client({ name: 'test', version: '0.0.0' })
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair()
  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport)
  ])
  onTestFinished(async () => {
    await client.close()
    await server.close()
  })
  return client
}

async function call(client, name, args = {}) {
  const result = await client.callTool({ name, arguments: args })
  return {
    text: result.content.map(part => part.text).join(''),
    isError: result.isError === true
  }
}

test('announces itself with the installed versions and page counts', async () => {
  const client = await connect()
  expect(client.getServerVersion()).toEqual({ name: 'quasar', version })
  const instructions = client.getInstructions()
  expect(instructions).toContain('quasar 2.33.0: 3 documentation pages')
  expect(instructions).toContain(
    '@quasar/app-vite 3.9.0: 1 documentation pages'
  )
  expect(instructions).toContain('API descriptors')
  expect(instructions).not.toContain('Updates available')
})

test('tells the model what is missing and what is out of date', async () => {
  const client = await connect({
    fixture: { appVite: false, quasarDocs: false },
    checkUpdates: () =>
      Promise.resolve([
        { name: '@quasar/mcp', version, latest: void 0 },
        { name: 'quasar', version: '2.33.0', latest: '2.34.0' }
      ])
  })
  const instructions = client.getInstructions()
  expect(instructions).toContain('@quasar/app-vite: not installed')
  expect(instructions).toContain(
    'quasar 2.33.0: installed, but this release bundles no documentation'
  )
  expect(instructions).toContain(
    'quasar 2.34.0 is available (installed: 2.33.0)'
  )
})

test('exposes the six tools', async () => {
  const client = await connect()
  const { tools } = await client.listTools()
  expect(tools.map(tool => tool.name).sort()).toEqual([
    'check_updates',
    'get_api',
    'get_page',
    'list_api',
    'list_pages',
    'search_docs'
  ])
})

test('list_pages groups by package and filters by it', async () => {
  const client = await connect()
  const all = await call(client, 'list_pages')
  expect(all.text).toContain('# quasar 2.33.0')
  expect(all.text).toContain(
    '- vue-components/button: Button (The QBtn component.)'
  )
  expect(all.text).toContain('# @quasar/app-vite 3.9.0')

  const cli = await call(client, 'list_pages', { package: '@quasar/app-vite' })
  expect(cli.text).not.toContain('# quasar 2.33.0')
  expect(cli.text).toContain('- quasar-cli-vite/boot-files: Boot files')
})

test('search_docs returns routes with snippets', async () => {
  const client = await connect()
  const { text } = await call(client, 'search_docs', { query: 'boot' })
  expect(text).toContain('- quasar-cli-vite/boot-files: Boot files')
  expect(text).toContain('> Boot files run before')

  const miss = await call(client, 'search_docs', { query: 'unicorn' })
  expect(miss.text).toContain('No page matches')
})

test('get_page serves a page, a section, and explains a miss', async () => {
  const client = await connect()
  const page = await call(client, 'get_page', {
    route: 'https://quasar.dev/vue-components/button'
  })
  expect(page.isError).toBe(false)
  expect(page.text).toContain('title: Button')
  expect(page.text).toContain('## Loading state')

  const section = await call(client, 'get_page', {
    route: 'vue-components/button',
    section: 'Usage'
  })
  expect(section.text.startsWith('## Usage')).toBe(true)
  expect(section.text).not.toContain('## Loading state')

  const badSection = await call(client, 'get_page', {
    route: 'vue-components/button',
    section: 'Nope'
  })
  expect(badSection.isError).toBe(true)
  expect(badSection.text).toContain('QBtn API | Usage | Standard')

  const miss = await call(client, 'get_page', { route: 'components/button' })
  expect(miss.isError).toBe(true)
  expect(miss.text).toContain('Similar routes: vue-components/button')
})

test('get_page names the offline gap when a package lacks docs', async () => {
  const client = await connect({ fixture: { quasarDocs: false } })
  const miss = await call(client, 'get_page', {
    route: 'vue-components/button'
  })
  expect(miss.isError).toBe(true)
  expect(miss.text).toContain(
    'Not available offline: quasar 2.33.0 bundles no documentation (bundled since 2.33.0), upgrade it.'
  )
})

test('get_page names the package a miss may belong to when it is not installed', async () => {
  const client = await connect({ fixture: { appVite: false } })
  const miss = await call(client, 'get_page', {
    route: 'https://quasar.dev/quasar-cli-vite/boot-files'
  })
  expect(miss.isError).toBe(true)
  expect(miss.text).toBe(
    'No page at "quasar-cli-vite/boot-files". Use search_docs or list_pages to find the route. Not available offline: @quasar/app-vite is not installed in this project.'
  )
  const served = await call(client, 'get_page', {
    route: 'https://quasar.dev/vue-components/button#usage'
  })
  expect(served.isError).toBe(false)
  expect(served.text).toContain('title: Button')
})

test('get_api serves the descriptor, one part of it, or a suggestion', async () => {
  const client = await connect()
  const whole = await call(client, 'get_api', { name: 'btn' })
  const api = JSON.parse(whole.text)
  expect(api.name).toBe('QBtn')
  expect(Object.keys(api.props)).toEqual(['label', 'loading'])

  const part = await call(client, 'get_api', { name: 'QBtn', part: 'events' })
  expect(JSON.parse(part.text)).toEqual({
    name: 'QBtn',
    events: {
      click: { desc: 'Emitted when the component is clicked', params: {} }
    }
  })

  const noPart = await call(client, 'get_api', {
    name: 'QBtn',
    part: 'methods'
  })
  expect(noPart.isError).toBe(true)
  expect(noPart.text).toContain('It has: props, slots, events.')

  const miss = await call(client, 'get_api', { name: 'QNotif' })
  expect(miss.isError).toBe(true)
  expect(miss.text).toContain('Similar names: Notify')

  const list = await call(client, 'list_api')
  expect(list.text).toBe('Notify\nQBtn')
})

test('check_updates refreshes from the registry and reports', async () => {
  const checkUpdates = vi.fn((project, opts) =>
    Promise.resolve(
      opts?.refresh === true
        ? [
            { name: '@quasar/mcp', version, latest: '9.0.0' },
            { name: 'quasar', version: '2.33.0', latest: void 0 }
          ]
        : []
    )
  )
  const client = await connect({ checkUpdates })
  const { text } = await call(client, 'check_updates')
  expect(checkUpdates).toHaveBeenLastCalledWith(expect.anything(), {
    refresh: true
  })
  expect(text).toContain(
    `@quasar/mcp 9.0.0 is available (installed: ${version})`
  )
  expect(text).not.toContain('quasar 2.33.0 is available')
})
