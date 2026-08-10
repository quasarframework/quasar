import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QParallax.hydration.fixtures.js'

const fixturesPath = 'src/components/parallax/QParallax.hydration.fixtures.js'

describe('QParallax SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
