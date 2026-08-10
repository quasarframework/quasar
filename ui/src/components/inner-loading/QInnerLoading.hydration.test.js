import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QInnerLoading.hydration.fixtures.js'

const fixturesPath =
  'src/components/inner-loading/QInnerLoading.hydration.fixtures.js'

describe('QInnerLoading SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
