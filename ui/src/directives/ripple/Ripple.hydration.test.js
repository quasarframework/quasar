import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './Ripple.hydration.fixtures.js'

const fixturesPath = 'src/directives/ripple/Ripple.hydration.fixtures.js'

describe('Ripple directive SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
