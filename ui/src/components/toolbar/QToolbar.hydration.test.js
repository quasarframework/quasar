import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QToolbar.hydration.fixtures.js'

const fixturesPath = 'src/components/toolbar/QToolbar.hydration.fixtures.js'

describe('QToolbar SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
