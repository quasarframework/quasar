import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QResizeObserver.hydration.fixtures.js'

const fixturesPath =
  'src/components/resize-observer/QResizeObserver.hydration.fixtures.js'

describe('QResizeObserver SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
