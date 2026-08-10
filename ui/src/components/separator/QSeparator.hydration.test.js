import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QSeparator.hydration.fixtures.js'

const fixturesPath = 'src/components/separator/QSeparator.hydration.fixtures.js'

describe('QSeparator SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
