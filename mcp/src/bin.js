#!/usr/bin/env node

import { parseArgs } from 'node:util'

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import { loadProject } from './project.js'
import { createServer } from './server.js'
import { version } from './version.js'

const usage = `Usage: quasar-mcp [--project <dir>]

MCP server (stdio) for the Quasar documentation and component API of the
packages installed in a project. Point your MCP client at it, e.g.:

  { "mcpServers": { "quasar": { "command": "npx", "args": ["-y", "--fetch-retries=0", "@quasar/mcp@latest"] } } }

Options:
  --project <dir>  Project to serve, the one whose installed quasar and
                   @quasar/app-vite carry the docs (default: cwd; a
                   workspace root with none serves the apps below it)
  -v, --version    Print the version and exit
  -h, --help       Print this help and exit
`

let values
try {
  ;({ values } = parseArgs({
    options: {
      project: { type: 'string' },
      version: { type: 'boolean', short: 'v' },
      help: { type: 'boolean', short: 'h' }
    },
    strict: true
  }))
} catch (err) {
  console.error(err.message)
  console.error(usage)
  process.exit(1)
}

if (values.help === true) {
  console.log(usage)
  process.exit()
}

if (values.version === true) {
  console.log(version)
  process.exit()
}

// stdout carries the protocol: anything else a dependency might print
// there would corrupt the session, so route every console channel to
// stderr, which MCP clients keep as the server's log.
for (const channel of ['log', 'info', 'debug', 'table', 'dir']) {
  console[channel] = console.error
}

const project = loadProject(values.project)
const server = await createServer({ project })
await server.connect(new StdioServerTransport())
