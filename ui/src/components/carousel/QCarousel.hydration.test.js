import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QCarousel.hydration.fixtures.js'

const fixturesPath = 'src/components/carousel/QCarousel.hydration.fixtures.js'

describe('QCarousel SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
