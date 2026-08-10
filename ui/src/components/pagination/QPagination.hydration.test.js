import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QPagination.hydration.fixtures.js'

const fixturesPath =
  'src/components/pagination/QPagination.hydration.fixtures.js'

describe('QPagination SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
