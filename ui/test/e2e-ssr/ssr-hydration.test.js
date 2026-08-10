import { join, normalize } from 'node:path'
import { globSync } from 'tinyglobby'
import { chromium } from 'playwright'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { getFreePort, startSsrDevServer } from './dev-server.js'

const playgroundPagesDir = normalize(
  join(import.meta.dirname, '../../playground/src/pages')
)

// mirror of the playground router: every two-level page maps to a
// route (see /ui/playground/src/router/pages.js), plus the index
const routes = [
  '/',
  ...globSync('*/*.vue', { cwd: playgroundPagesDir }).map(
    page => '/' + page.slice(0, -4)
  )
]

// Vue only reports hydration mismatches in dev builds, through
// console warnings/errors — the exact channel the component-level
// hydration suite watches (/ui/test/hydration/hydrate.js)
const hydrationRE = /hydrat/i

let baseUrl, stopServer, browser, context

beforeAll(async () => {
  const port = await getFreePort()
  baseUrl = `http://localhost:${port}`
  stopServer = await startSsrDevServer(port)
  browser = await chromium.launch()
  context = await browser.newContext()
})

afterAll(async () => {
  await context?.close()
  await browser?.close()
  stopServer?.()
})

async function auditRoute(route) {
  const page = await context.newPage()
  const messages = []

  page.on('console', msg => {
    if (
      ['warning', 'error'].includes(msg.type()) &&
      hydrationRE.test(msg.text())
    ) {
      messages.push(msg.text())
    }
  })
  page.on('pageerror', err => {
    if (hydrationRE.test(err.message)) {
      messages.push(err.message)
    }
  })

  try {
    await page.goto(baseUrl + route, { waitUntil: 'load', timeout: 60_000 })
    // hydration runs right after the entry boots; give it a beat
    await page.waitForTimeout(400)
  } finally {
    await page.close()
  }

  return messages
}

// one test per route, concurrent up to the config's maxConcurrency —
// granular reporting (and junit entries) at the same wall-clock cost
// as a manual worker pool
describe(`playground SSR hydration sweep (${routes.length} routes)`, () => {
  for (const route of routes) {
    test.concurrent(`${route} hydrates without console output`, async () => {
      const messages = await auditRoute(route)

      expect(messages).toEqual([])
    })
  }
})
