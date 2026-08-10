import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QBanner.hydration.fixtures.js'

const fixturesPath = 'src/components/banner/QBanner.hydration.fixtures.js'

describe('QBanner SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
