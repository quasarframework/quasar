/**
 * CLI over generate.js.
 *
 * Run: pnpm generate:mcp [--target ui|app-vite]  (from docs/)
 * Or:  node docs/build/mcp/index.js [--target ui|app-vite]
 */

import { parseArgs } from 'node:util'

import { generate } from './generate.js'

try {
  const { values } = parseArgs({
    options: { target: { type: 'string' } },
    strict: true
  })
  generate({ target: values.target ?? null })
} catch (err) {
  console.error('[mcp] FATAL', err.message)
  process.exit(1)
}
