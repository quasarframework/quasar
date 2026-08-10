import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QSplitter.hydration.fixtures.js'

const fixturesPath = 'src/components/splitter/QSplitter.hydration.fixtures.js'

describe('QSplitter SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
