import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QPopupProxy.hydration.fixtures.js'

const fixturesPath =
  'src/components/popup-proxy/QPopupProxy.hydration.fixtures.js'

describe('QPopupProxy SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
