import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QBtnDropdown.hydration.fixtures.js'

const fixturesPath =
  'src/components/btn-dropdown/QBtnDropdown.hydration.fixtures.js'

describe('QBtnDropdown SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
