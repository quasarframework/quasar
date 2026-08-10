import { join, normalize } from 'node:path'
import { globSync } from 'tinyglobby'
import { chromium } from 'playwright'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { resolveServer } from './dev-server.js'

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

// match only the message's first line: stack traces of UNRELATED
// runtime errors (e.g. a page logging a failed fetch) always contain
// vue's internal "at hydrate (...)" frame and would false-positive
const isHydrationMessage = text => hydrationRE.test(text.split('\n', 1)[0])

let baseUrl, stopServer, browser, context

// per-route invocation counts: the config's retry re-runs a failed
// test body, so >1 attempts on a passing run means the retry masked a
// nondeterministic failure — report-worthy, never routine noise
const attempts = new Map()

beforeAll(async () => {
  ;({ baseUrl, stop: stopServer } = await resolveServer())
  browser = await chromium.launch()
  context = await browser.newContext()

  // the sweep audits hydration, not CDN availability: external
  // resources (cdn images, video embeds) tie the 'load' event to the
  // network and made image/video-heavy routes time out intermittently
  // — only the dev server's own responses may gate it
  const serverHost = new URL(baseUrl).hostname
  await context.route(
    url => url.hostname !== serverHost,
    route => route.abort()
  )
})

afterAll(async () => {
  await context?.close()
  await browser?.close()
  stopServer?.()

  const flaky = [...attempts]
    .filter(([, count]) => count > 1)
    .map(([route, count]) => `${route} (${count} attempts)`)

  if (flaky.length !== 0) {
    const message =
      'SSR hydration sweep needed retries — intermittent ' +
      `nondeterminism to investigate: ${flaky.join(', ')}`

    console.error(`\nFLAKY: ${message}\n`)

    if (process.env.GITHUB_ACTIONS) {
      console.log(`::warning title=Flaky SSR hydration sweep::${message}`)
    }
  }
})

async function auditRoute(route) {
  const page = await context.newPage()
  const messages = []

  page.on('console', msg => {
    if (
      ['warning', 'error'].includes(msg.type()) &&
      isHydrationMessage(msg.text())
    ) {
      messages.push(msg.text())
    }
  })
  page.on('pageerror', err => {
    if (isHydrationMessage(err.message)) {
      messages.push(err.message)
    }
  })

  try {
    await page.goto(baseUrl + route, { waitUntil: 'load', timeout: 60_000 })
    // positive completion signal instead of a timing guess: the
    // playground's ssr-client boot flips this from $q.onSSRHydrated,
    // which the CLI client entry calls right after the hydrating
    // mount returns — every mismatch is reported by then, and CDP
    // delivers those earlier console events over the same ordered
    // connection before this poll can resolve
    await page.waitForFunction(
      () => window.__E2E_SSR_HYDRATED__ === true,
      null,
      { timeout: 30_000 }
    )
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
      attempts.set(route, (attempts.get(route) ?? 0) + 1)

      const messages = await auditRoute(route)

      expect(messages).toEqual([])
    })
  }
})
