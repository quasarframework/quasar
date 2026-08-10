import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QCircularProgress.hydration.fixtures.js'

const fixturesPath =
  'src/components/circular-progress/QCircularProgress.hydration.fixtures.js'

describe('QCircularProgress SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
