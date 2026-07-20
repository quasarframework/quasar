import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import process from 'node:process'
import { z } from 'zod'

import { ArtifactStore } from './artifact/store.js'
import { registerResources } from './resources.js'
import {
  getQuasarApi,
  getQuasarComposable,
  getQuasarDoc,
  getQuasarExamples,
  getQuasarMcpInfo,
  searchQuasarDocs
} from './tools/retrieval.js'

const maxCharacters = z.number().int().min(1000).max(30_000).default(12_000)
const readOnlyAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false
}

export function createServer(options = {}) {
  const store = options.store ?? new ArtifactStore(options.artifactRoot)
  const server = new McpServer(
    { name: '@quasar/mcp', version: '0.1.0' },
    {
      instructions:
        'Search official Quasar material first, then retrieve narrow documentation sections, exact API members, examples, or composables. All content is read-only and includes version provenance.'
    }
  )

  server.registerTool(
    'searchQuasarDocs',
    {
      title: 'Search official Quasar documentation',
      description:
        'Search official Quasar UI component, directive, plugin, composable, API, and example records.',
      inputSchema: z.object({
        query: z.string().min(1),
        kinds: z
          .array(z.enum(['component', 'directive', 'plugin', 'composable']))
          .optional(),
        limit: z.number().int().min(1).max(25).default(10),
        maxCharacters
      }),
      annotations: readOnlyAnnotations
    },
    input => searchQuasarDocs(store, input)
  )

  server.registerTool(
    'getQuasarDoc',
    {
      title: 'Get official Quasar documentation',
      description:
        'Retrieve an official Quasar documentation page or one retrieval-sized section.',
      inputSchema: z.object({
        id: z.string().min(1),
        section: z.string().min(1).optional(),
        maxCharacters
      }),
      annotations: readOnlyAnnotations
    },
    input => getQuasarDoc(store, input)
  )

  server.registerTool(
    'getQuasarApi',
    {
      title: 'Get an exact Quasar API contract',
      description:
        'Retrieve a complete public API, one member group, or an exact prop, slot, event, method, or computed property.',
      inputSchema: z.object({
        name: z.string().min(1),
        memberType: z
          .enum(['props', 'slots', 'events', 'methods', 'computedProps'])
          .optional(),
        member: z.string().min(1).optional(),
        maxCharacters
      }),
      annotations: readOnlyAnnotations
    },
    input => getQuasarApi(store, input)
  )

  server.registerTool(
    'getQuasarExamples',
    {
      title: 'Get official Quasar examples',
      description:
        'Retrieve official Vue examples for a Quasar API or page, optionally narrowed by a query.',
      inputSchema: z.object({
        name: z.string().min(1),
        query: z.string().min(1).optional(),
        limit: z.number().int().min(1).max(10).default(3),
        maxCharacters
      }),
      annotations: readOnlyAnnotations
    },
    input => getQuasarExamples(store, input)
  )

  server.registerTool(
    'getQuasarComposable',
    {
      title: 'Get a public Quasar composable',
      description:
        'Retrieve an official public Quasar composable guide and optionally its implementation source.',
      inputSchema: z.object({
        name: z.string().min(1),
        includeSource: z.boolean().default(false),
        maxCharacters
      }),
      annotations: readOnlyAnnotations
    },
    input => getQuasarComposable(store, input)
  )

  server.registerTool(
    'getQuasarMcpInfo',
    {
      title: 'Get Quasar MCP artifact information',
      description:
        'Return server version, source provenance, coverage, tool inventory, and safety properties.',
      inputSchema: z.object({ maxCharacters }),
      annotations: readOnlyAnnotations
    },
    input => getQuasarMcpInfo(store, input)
  )

  registerResources(server, store)
  return { server, store }
}

export async function startServer() {
  const { server } = createServer()
  const transport = new StdioServerTransport()

  process.on('SIGINT', async () => {
    await server.close()
    process.exit(0)
  })

  await server.connect(transport)
}
