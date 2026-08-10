import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QSlideItem.hydration.fixtures.js'

const fixturesPath =
  'src/components/slide-item/QSlideItem.hydration.fixtures.js'

describe('QSlideItem SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
