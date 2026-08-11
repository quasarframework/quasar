import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QFab.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QFab SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
