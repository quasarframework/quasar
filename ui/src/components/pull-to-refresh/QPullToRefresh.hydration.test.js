import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QPullToRefresh.hydration.fixtures.js'

const fixturesPath =
  'src/components/pull-to-refresh/QPullToRefresh.hydration.fixtures.js'

describe('QPullToRefresh SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
