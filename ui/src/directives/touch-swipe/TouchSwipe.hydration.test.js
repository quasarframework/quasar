import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './TouchSwipe.hydration.fixtures.js'

const fixturesPath =
  'src/directives/touch-swipe/TouchSwipe.hydration.fixtures.js'

describe('TouchSwipe directive SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
