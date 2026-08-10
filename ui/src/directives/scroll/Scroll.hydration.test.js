import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './Scroll.hydration.fixtures.js'

const fixturesPath = 'src/directives/scroll/Scroll.hydration.fixtures.js'

describe('Scroll directive SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
