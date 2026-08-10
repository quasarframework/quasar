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

const WORKERS = 4

// Vue only reports hydration mismatches in dev builds, through
// console warnings/errors — the exact channel the component-level
// hydration suite watches (/ui/test/hydration/hydrate.js)
const hydrationRE = /hydrat/i

let baseUrl, stopServer, browser

beforeAll(async () => {
  const port = await getFreePort()
  baseUrl = `http://localhost:${port}`
  stopServer = await startSsrDevServer(port)
  browser = await chromium.launch()
})

afterAll(async () => {
  await browser?.close()
  stopServer?.()
})

async function auditRoute(context, route) {
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

describe('playground SSR hydration sweep', () => {
  test(`every route (${routes.length}) hydrates without console output`, async () => {
    const context = await browser.newContext()
    const queue = [...routes]
    const offenders = []

    await Promise.all(
      Array.from({ length: WORKERS }, async () => {
        for (;;) {
          const route = queue.shift()
          if (route === void 0) return

          const messages = await auditRoute(context, route)
          if (messages.length !== 0) {
            offenders.push({ route, messages })
          }
        }
      })
    )

    await context.close()

    offenders.sort((a, b) => a.route.localeCompare(b.route))
    expect(offenders).toEqual([])
  })
})
