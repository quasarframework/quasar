import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QSkeleton.hydration.fixtures.js'

const fixturesPath = 'src/components/skeleton/QSkeleton.hydration.fixtures.js'

describe('QSkeleton SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
