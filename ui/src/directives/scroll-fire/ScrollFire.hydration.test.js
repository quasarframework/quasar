import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './ScrollFire.hydration.fixtures.js'

const fixturesPath =
  'src/directives/scroll-fire/ScrollFire.hydration.fixtures.js'

describe('ScrollFire directive SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
