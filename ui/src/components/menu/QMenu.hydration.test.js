import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QMenu.hydration.fixtures.js'

const fixturesPath = 'src/components/menu/QMenu.hydration.fixtures.js'

describe('QMenu SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
