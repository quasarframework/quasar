import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QPopupEdit.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QPopupEdit SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
