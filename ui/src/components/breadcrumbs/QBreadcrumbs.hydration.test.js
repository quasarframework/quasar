import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, setupApp, withTo } from './QBreadcrumbs.hydration.fixtures.js'

const fixturesPath =
  'src/components/breadcrumbs/QBreadcrumbs.hydration.fixtures.js'

describe('QBreadcrumbs SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic, { setupApp })

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly with router-link crumbs', async () => {
    const result = await hydrate(fixturesPath, 'withTo', withTo, { setupApp })

    expect(result.consoleOutput).toEqual([])
    // the crumbs server-rendered as actual links, the current-route
    // one already carrying its active state
    expect(result.serverHtml).toContain('href="/target"')
    expect(result.serverHtml).toContain('q-router-link--exact-active')
  })
})
