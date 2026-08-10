import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QBadge.hydration.fixtures.js'

const fixturesPath = 'src/components/badge/QBadge.hydration.fixtures.js'

describe('QBadge SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
