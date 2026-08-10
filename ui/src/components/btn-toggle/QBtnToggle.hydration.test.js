import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QBtnToggle.hydration.fixtures.js'

const fixturesPath =
  'src/components/btn-toggle/QBtnToggle.hydration.fixtures.js'

describe('QBtnToggle SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
