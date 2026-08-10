import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QEditor.hydration.fixtures.js'

const fixturesPath = 'src/components/editor/QEditor.hydration.fixtures.js'

describe('QEditor SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
