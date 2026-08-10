import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QBtnGroup.hydration.fixtures.js'

const fixturesPath = 'src/components/btn-group/QBtnGroup.hydration.fixtures.js'

describe('QBtnGroup SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
