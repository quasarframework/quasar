import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './Mutation.hydration.fixtures.js'

const fixturesPath = 'src/directives/mutation/Mutation.hydration.fixtures.js'

describe('Mutation directive SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
