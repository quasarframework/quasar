import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QIcon.hydration.fixtures.js'

const fixturesPath = 'src/components/icon/QIcon.hydration.fixtures.js'

describe('QIcon SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
