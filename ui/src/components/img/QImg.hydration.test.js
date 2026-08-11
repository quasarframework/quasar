import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, noSpinner, withPlaceholder } from './QImg.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QImg SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly with a placeholder', async () => {
    const result = await hydrate(
      fixturesPath,
      'withPlaceholder',
      withPlaceholder
    )

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly without a spinner', async () => {
    const result = await hydrate(fixturesPath, 'noSpinner', noSpinner)

    expect(result.consoleOutput).toEqual([])
  })
})
