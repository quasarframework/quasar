import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QInfiniteScroll.hydration.fixtures.js'

const fixturesPath =
  'src/components/infinite-scroll/QInfiniteScroll.hydration.fixtures.js'

describe('QInfiniteScroll SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
