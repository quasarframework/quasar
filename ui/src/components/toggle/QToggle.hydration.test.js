import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QToggle.hydration.fixtures.js'

const fixturesPath = 'src/components/toggle/QToggle.hydration.fixtures.js'

describe('QToggle SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
