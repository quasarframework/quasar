import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QScrollObserver.hydration.fixtures.js'

const fixturesPath =
  'src/components/scroll-observer/QScrollObserver.hydration.fixtures.js'

describe('QScrollObserver SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
