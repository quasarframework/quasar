import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, bottom } from './QPullToRefresh.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QPullToRefresh SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly with another side', async () => {
    const result = await hydrate(fixturesPath, 'bottom', bottom)

    expect(result.consoleOutput).toEqual([])
  })
})
