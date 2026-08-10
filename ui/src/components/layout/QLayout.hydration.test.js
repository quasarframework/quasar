import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QLayout.hydration.fixtures.js'

const fixturesPath = 'src/components/layout/QLayout.hydration.fixtures.js'

describe('QLayout SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
