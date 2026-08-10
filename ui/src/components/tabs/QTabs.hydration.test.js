import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, setupApp, withRouteTab } from './QTabs.hydration.fixtures.js'

const fixturesPath = 'src/components/tabs/QTabs.hydration.fixtures.js'

describe('QTabs SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic, { setupApp })

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly with a QRouteTab', async () => {
    const result = await hydrate(fixturesPath, 'withRouteTab', withRouteTab, {
      setupApp
    })

    expect(result.consoleOutput).toEqual([])
    expect(result.host.textContent).toContain('Route tab')
  })
})
