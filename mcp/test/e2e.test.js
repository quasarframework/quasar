import { spawn } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { beforeAll, expect, onTestFinished, test } from 'vitest'

import {
  API_PARTS,
  MEMBER_PARTS,
  readApiMarkdown,
  readApiMembersMarkdown
} from '../src/api.js'
import { DOCS_FORMAT } from '../src/docs.js'

// The contract between the docs generator (docs/build/mcp, --target)
// and this server, exercised on the slices the monorepo's own ui and
// app-vite packages carry: a project whose node_modules link them,
// served by the real bin over stdio.

const repoRoot = join(import.meta.dirname, '../..')
const bin = join(import.meta.dirname, '../src/bin.js')
const packages = [
  { name: 'quasar', dir: join(repoRoot, 'ui') },
  { name: '@quasar/app-vite', dir: join(repoRoot, 'app-vite') }
]

let projectDir

beforeAll(() => {
  projectDir = mkdtempSync(join(tmpdir(), 'quasar-mcp-e2e-'))
  writeFileSync(
    join(projectDir, 'package.json'),
    '{ "name": "e2e", "private": true }'
  )
  mkdirSync(join(projectDir, 'node_modules/@quasar'), { recursive: true })
  for (const pkg of packages) {
    symlinkSync(pkg.dir, join(projectDir, 'node_modules', pkg.name), 'dir')
  }
  return () => {
    rmSync(projectDir, { recursive: true, force: true })
  }
})

async function connect() {
  const client = new Client({ name: 'e2e', version: '0.0.0' })
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [bin, '--project', projectDir],
      stderr: 'pipe'
    })
  )
  onTestFinished(() => client.close())
  return client
}

async function call(client, name, args = {}) {
  const result = await client.callTool({ name, arguments: args })
  return {
    text: result.content.map(part => part.text).join(''),
    isError: result.isError === true
  }
}

function readMeta(pkg) {
  return JSON.parse(readFileSync(join(pkg.dir, 'dist/mcp/meta.json'), 'utf8'))
}

test('each slice indexes its own package and every page it lists exists', () => {
  for (const pkg of packages) {
    const meta = readMeta(pkg)
    const { version } = JSON.parse(
      readFileSync(join(pkg.dir, 'package.json'), 'utf8')
    )
    expect(meta.package, pkg.name).toBe(pkg.name)
    expect(meta.version, pkg.name).toBe(version)
    expect(meta.pages.length, pkg.name).toBeGreaterThan(50)
    for (const page of meta.pages) {
      expect(typeof page.title, page.route).toBe('string')
      expect(
        existsSync(join(pkg.dir, 'dist/mcp', `${page.route}.md`)),
        page.route
      ).toBe(true)
    }
  }
})

test('the slices split the site: components to quasar, the CLI to app-vite, the agents page to both', () => {
  const [ui, appVite] = packages.map(readMeta)
  const routesOf = meta => new Set(meta.pages.map(page => page.route))
  const uiRoutes = routesOf(ui)
  const cliRoutes = routesOf(appVite)

  expect(uiRoutes.has('vue-components/button')).toBe(true)
  expect(cliRoutes.has('vue-components/button')).toBe(false)
  expect(cliRoutes.has('quasar-cli-vite/boot-files')).toBe(true)
  expect(uiRoutes.has('quasar-cli-vite/boot-files')).toBe(false)
  expect(uiRoutes.has('start/ai-agents')).toBe(true)
  expect(cliRoutes.has('start/ai-agents')).toBe(true)
  expect(uiRoutes.has('how-to-contribute/contribution-guide')).toBe(false)
  expect(cliRoutes.has('how-to-contribute/contribution-guide')).toBe(false)
})

test('the server announces both packages at their real versions', async () => {
  const client = await connect()
  const instructions = client.getInstructions()
  // a page both slices carry is served by the first package listing it
  const served = new Set()
  for (const pkg of packages) {
    const meta = readMeta(pkg)
    const routes = meta.pages
      .map(page => page.route)
      .filter(route => !served.has(route))
    for (const route of routes) served.add(route)
    expect(instructions).toContain(
      `${pkg.name} ${meta.version}: ${routes.length} documentation pages`
    )
  }
  expect(instructions).not.toContain('not installed')
  expect(instructions).not.toContain('bundles no documentation')
})

test('a component page points at get_api, and get_api resolves the same descriptor', async () => {
  const client = await connect()
  const page = await call(client, 'get_page', {
    route: 'vue-components/button'
  })
  expect(page.isError).toBe(false)
  expect(page.text).toContain('## QBtn API')
  expect(page.text).toContain('call the `get_api` tool with `name: "QBtn"`')
  expect(page.text).not.toContain('### Props')

  const api = await call(client, 'get_api', { name: 'QBtn', part: 'props' })
  expect(api.isError).toBe(false)
  expect(api.text.startsWith('### Props\n\n- `')).toBe(true)
  expect(api.text).toContain('`label` (string | number, optional)')
  expect(api.text).not.toContain('### Events')

  const whole = await call(client, 'get_api', { name: 'QBtn' })
  expect(whole.text.startsWith('## QBtn API\n')).toBe(true)

  // a prop and a scoped slot share the name: both come, each under its heading
  const member = await call(client, 'get_api', {
    name: 'QTable',
    member: 'pagination'
  })
  expect(member.text.startsWith('### Props\n\n- `pagination`')).toBe(true)
  expect(member.text).toContain('\n### Scoped Slots\n\n- `#pagination`')
  expect(member.text).not.toContain('\n- `rows`')

  // with part, the one entry, verbatim from its section and a fraction of it
  const prop = await call(client, 'get_api', {
    name: 'QTable',
    member: 'pagination',
    part: 'props'
  })
  const propsPart = await call(client, 'get_api', {
    name: 'QTable',
    part: 'props'
  })
  expect(prop.text).not.toContain('### Scoped Slots')
  expect(propsPart.text).toContain(
    prop.text.trim().replace(/^### Props\n\n/, '')
  )
  expect(prop.text.length * 4).toBeLessThan(propsPart.text.length)

  const json = await call(client, 'get_api', {
    name: 'QBtn',
    part: 'props',
    format: 'json'
  })
  const { name, props } = JSON.parse(json.text)
  expect(name).toBe('QBtn')
  expect(props.label.type).toEqual(['String', 'Number'])
})

test('search leads to the page about the subject, in either package', async () => {
  const client = await connect()
  const button = await call(client, 'search_docs', { query: 'QBtn', limit: 1 })
  expect(button.text.startsWith('- vue-components/button:')).toBe(true)

  const boot = await call(client, 'search_docs', {
    query: 'boot files',
    limit: 1
  })
  expect(boot.text.startsWith('- quasar-cli-vite/boot-files:')).toBe(true)
  expect(boot.text).toMatch(/\n {2}sections: .+/)

  const outline = await call(client, 'get_page', {
    route: 'vue-components/button',
    outline: true
  })
  expect(outline.text.startsWith('# Button\n')).toBe(true)
  expect(outline.text).toContain('\n## Usage\n')
  expect(outline.text).not.toContain('```')

  const section = await call(client, 'get_page', {
    route: 'quasar-cli-vite/boot-files',
    section: 'Anatomy of a boot file'
  })
  expect(section.isError).toBe(false)
  expect(section.text.startsWith('## Anatomy of a boot file')).toBe(true)

  const linked = await call(client, 'get_page', {
    route:
      'https://quasar.dev/quasar-cli-vite/boot-files#anatomy-of-a-boot-file'
  })
  expect(linked.text).toBe(section.text)

  // the long pages are the ones an agent must be warned about
  const table = await call(client, 'search_docs', { query: 'QTable', limit: 1 })
  expect(table.text).toMatch(/^- vue-components\/table: .+ \[~\d+k tokens\]\n/)
})

test('a workspace root serves every app below it, by name', async () => {
  const root = mkdtempSync(join(tmpdir(), 'quasar-mcp-e2e-workspace-'))
  onTestFinished(() => {
    rmSync(root, { recursive: true, force: true })
  })
  writeFileSync(join(root, 'package.json'), '{ "name": "ws", "private": true }')
  const link = (app, names) => {
    mkdirSync(join(root, app, 'node_modules/@quasar'), { recursive: true })
    for (const pkg of packages.filter(entry => names.includes(entry.name))) {
      symlinkSync(pkg.dir, join(root, app, 'node_modules', pkg.name), 'dir')
    }
  }
  link('apps/web', ['quasar', '@quasar/app-vite'])
  link('libs/ui', ['quasar'])

  const client = new Client({ name: 'e2e', version: '0.0.0' })
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [bin, '--project', root],
      stderr: 'pipe'
    })
  )
  onTestFinished(() => client.close())

  const [ui, appVite] = packages.map(readMeta)
  const instructions = client.getInstructions()
  expect(instructions).toContain(
    `served from the packages installed in apps/web, the Quasar app found below ${root}.`
  )
  expect(instructions).toContain(
    `Other Quasar apps in this workspace: libs/ui (quasar ${ui.version}).`
  )

  const { tools } = await client.listTools()
  const getApi = tools.find(tool => tool.name === 'get_api')
  expect(getApi.inputSchema.properties.app.enum).toEqual([
    'apps/web',
    'libs/ui'
  ])

  const api = await call(client, 'get_api', {
    app: 'libs/ui',
    name: 'QBtn',
    part: 'events'
  })
  expect(api.isError).toBe(false)
  expect(
    api.text.startsWith(`Served from libs/ui: quasar ${ui.version}### Events`)
  ).toBe(true)

  const cliPage = await call(client, 'get_page', {
    app: 'libs/ui',
    route: 'quasar-cli-vite/boot-files',
    outline: true
  })
  expect(cliPage.isError).toBe(true)
  expect(cliPage.text).toContain('@quasar/app-vite is not installed')
  const served = await call(client, 'get_page', {
    route: 'quasar-cli-vite/boot-files',
    outline: true
  })
  expect(served.isError).toBe(false)
  expect(
    served.text.startsWith(
      `Served from apps/web: quasar ${ui.version}, @quasar/app-vite ${appVite.version}# Boot files`
    )
  ).toBe(true)
})

test('stdout carries nothing but protocol frames', async () => {
  const child = spawn(process.execPath, [bin, '--project', projectDir], {
    stdio: ['pipe', 'pipe', 'pipe']
  })
  onTestFinished(() => {
    child.kill()
  })

  let stdout = ''
  const done = new Promise(resolve => {
    child.stdout.on('data', chunk => {
      stdout += chunk
      if (stdout.includes('"id":2')) resolve()
    })
  })
  child.stdin.write(
    JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'raw', version: '0.0.0' }
      }
    }) +
      '\n' +
      JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) +
      '\n' +
      JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' }) +
      '\n'
  )
  await done

  const lines = stdout.trim().split('\n')
  expect(lines.length).toBe(2)
  for (const line of lines) {
    expect(JSON.parse(line).jsonrpc).toBe('2.0')
  }
})

// The slice format contract, on the slices this repo generates: what
// the generator writes is what this server parses. A renderer change
// that moves a heading or an entry line fails here, on the same
// branch, before anything is published; a deliberate change bumps
// DOCS_FORMAT on both sides and the server's major.
test('the generated slices are of the format this server reads, and every API part and member is reachable', () => {
  for (const pkg of ['quasar', '@quasar/app-vite']) {
    const meta = JSON.parse(
      readFileSync(
        join(projectDir, 'node_modules', pkg, 'dist/mcp/meta.json'),
        'utf8'
      )
    )
    expect(meta.format).toBe(DOCS_FORMAT)
    expect(meta.package).toBe(pkg)
    expect(typeof meta.version).toBe('string')
    for (const page of meta.pages) {
      expect(typeof page.route).toBe('string')
      expect(typeof page.title).toBe('string')
    }
  }

  const quasarDir = join(projectDir, 'node_modules/quasar')
  const docsDir = join(quasarDir, 'dist/mcp')
  const apiDir = join(quasarDir, 'dist/api')
  const names = readdirSync(apiDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.slice(0, -'.json'.length))
  expect(names.length).toBeGreaterThan(100)

  const unreachable = []
  for (const name of names) {
    const api = JSON.parse(readFileSync(join(apiDir, `${name}.json`), 'utf8'))
    if (readApiMarkdown(docsDir, name) === null) {
      unreachable.push(name)
      continue
    }
    for (const part of API_PARTS) {
      const data = api[part]
      const present =
        Boolean(data) &&
        (typeof data !== 'object' || Object.keys(data).length !== 0)
      if (!present) {
        continue
      }
      if (readApiMarkdown(docsDir, name, part) === null) {
        unreachable.push(`${name}.${part}`)
      }
      if (MEMBER_PARTS.includes(part)) {
        for (const member of Object.keys(data)) {
          if (
            readApiMembersMarkdown(docsDir, name, [{ part, name: member }]) ===
            null
          ) {
            unreachable.push(`${name}.${part}.${member}`)
          }
        }
      }
    }
  }
  expect(unreachable).toEqual([])
})
