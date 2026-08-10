import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QLinearProgress.hydration.fixtures.js'

const fixturesPath =
  'src/components/linear-progress/QLinearProgress.hydration.fixtures.js'

describe('QLinearProgress SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
