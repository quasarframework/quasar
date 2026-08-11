import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, setupApp, withTo } from './QItem.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QItem SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic, { setupApp })

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly as a router link', async () => {
    const result = await hydrate(fixturesPath, 'withTo', withTo, { setupApp })

    expect(result.consoleOutput).toEqual([])
    // it server-rendered as an actual link
    expect(result.serverHtml).toContain('href="/target"')
  })
})
