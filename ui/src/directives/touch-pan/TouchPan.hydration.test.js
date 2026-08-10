import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './TouchPan.hydration.fixtures.js'

const fixturesPath = 'src/directives/touch-pan/TouchPan.hydration.fixtures.js'

describe('TouchPan directive SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
