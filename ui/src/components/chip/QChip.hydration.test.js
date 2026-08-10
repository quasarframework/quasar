import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, states } from './QChip.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QChip SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly across states', async () => {
    const result = await hydrate(fixturesPath, 'states', states)

    expect(result.consoleOutput).toEqual([])
  })
})
