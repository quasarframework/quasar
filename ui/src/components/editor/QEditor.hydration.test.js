import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, readonly } from './QEditor.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QEditor SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly when readonly', async () => {
    const result = await hydrate(fixturesPath, 'readonly', readonly)

    expect(result.consoleOutput).toEqual([])
  })
})
