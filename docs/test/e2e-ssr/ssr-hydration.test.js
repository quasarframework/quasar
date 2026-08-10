import { join, normalize } from 'node:path'
import { globSync } from 'tinyglobby'
import { chromium } from 'playwright'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { resolveServer } from './dev-server.js'

const pagesDir = normalize(join(import.meta.dirname, '../../src/pages'))

// mirror of the docs router: every markdown page maps to a route (see
// /docs/src/router/routes.js + src/pages/listing.js), plus the
// landing; folder-form pages (<path>/<leaf>/<leaf>.md, like the menu
// convention in /docs/build/md/flat-menu.js) collapse the duplicated
// last segment
const routes = [
  ...new Set([
    '/',
    ...globSync('**/*.md', { cwd: pagesDir }).map(page => {
      const parts = page.slice(0, -3).split('/')

      if (parts.length > 1 && parts.at(-1) === parts.at(-2)) {
        parts.pop()
      }

      return '/' + parts.join('/')
    })
  ])
]

// Vue only reports hydration mismatches in dev builds, through
// console warnings/errors — the exact channel ui's hydration suites
// watch (/ui/test/hydration/hydrate.js)
const hydrationRE = /hydrat/i

let baseUrl, stopServer, browser, context

// per-route invocation counts: the config's retry re-runs a failed
// test body, so >1 attempts on a passing run means the retry masked a
// nondeterministic failure — report-worthy, never routine noise
const attempts = new Map()

beforeAll(async () => {
  ;({ baseUrl, stop: stopServer } = await resolveServer())
  browser = await chromium.launch()
  context = await browser.newContext()
  // for the page-interaction tests (copyHeading writes the anchor url)
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])

  // the sweep audits hydration, not CDN availability: external
  // resources (sponsor avatars, cdn images, embeds) tie the 'load'
  // event to the network and make heavy routes time out
  // intermittently — only the dev server's own responses may gate it
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
      'docs SSR hydration sweep needed retries — intermittent ' +
      `nondeterminism to investigate: ${flaky.join(', ')}`

    console.error(`\nFLAKY: ${message}\n`)

    if (process.env.GITHUB_ACTIONS) {
      console.log(`::warning title=Flaky docs SSR hydration sweep::${message}`)
    }
  }
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
    await page.goto(baseUrl + route, { waitUntil: 'load', timeout: 90_000 })
    // hydration runs right after the entry boots; give it a beat
    await page.waitForTimeout(400)

    // a 404 render hydrates cleanly too — catching it here keeps the
    // route derivation above honest against the real router mapping
    const notFound = await page.evaluate(
      () => document.querySelector('.page404') !== null
    )
    if (notFound) {
      messages.push('renders the 404 page')
    }
  } finally {
    await page.close()
  }

  return messages
}

// one test per route, concurrent up to the config's maxConcurrency —
// granular reporting (and junit entries) at minimal wall-clock cost
describe(`docs SSR hydration sweep (${routes.length} routes)`, () => {
  for (const route of routes) {
    test.concurrent(`${route} hydrates without console output`, async () => {
      attempts.set(route, (attempts.get(route) ?? 0) + 1)

      const messages = await auditRoute(route)

      expect(messages).toEqual([])
    })
  }
})

// browser-behavior coverage for src/assets/page-utils.js — its
// clipboard/history work cannot be meaningfully unit-tested (a node
// test would only assert its own mocks)
describe('page interactions', () => {
  // derived from the route list, like the sweep itself
  const samplePage = routes.find(route => route.startsWith('/vue-components/'))

  test('clicking a doc heading copies its anchor', async () => {
    const page = await context.newPage()

    try {
      await page.goto(baseUrl + samplePage, {
        waitUntil: 'load',
        timeout: 90_000
      })

      // every markdown h2-h6 carries the copyHeading handler (see
      // /docs/build/md/md-plugin-heading.js) — NOT the bare
      // .doc-heading selector: the page-title component renders a
      // lookalike div without it
      const heading = page.locator('h2.doc-heading').first()
      const id = await heading.getAttribute('id')

      // semantic click (a hit-tested one could land on the sticky
      // header), re-tried by the poll: right after load the handler
      // may not be hydrated yet
      await expect
        .poll(async () => {
          await heading.evaluate(el => el.click())
          return page.evaluate(() => location.hash)
        })
        .toBe(`#${id}`)

      // the anchor landed on the clipboard and a notification
      // confirmed it (matched by text — the GDPR notice shows too)
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        `${baseUrl}${samplePage}#${id}`
      )
      await page
        .locator('.q-notification', { hasText: 'Anchor has been copied' })
        .waitFor({ timeout: 5000 })
    } finally {
      await page.close()
    }
  })
})
