import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QVirtualScroll.hydration.fixtures.js'

const fixturesPath =
  'src/components/virtual-scroll/QVirtualScroll.hydration.fixtures.js'

describe('QVirtualScroll SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
