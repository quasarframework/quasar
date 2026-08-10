import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './ClosePopup.hydration.fixtures.js'

const fixturesPath =
  'src/directives/close-popup/ClosePopup.hydration.fixtures.js'

describe('ClosePopup directive SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
