import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './TouchHold.hydration.fixtures.js'

const fixturesPath = 'src/directives/touch-hold/TouchHold.hydration.fixtures.js'

describe('TouchHold directive SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
