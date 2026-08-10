import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, currentMonth } from './QDate.hydration.fixtures.js'

const fixturesPath = 'src/components/date/QDate.hydration.fixtures.js'

describe('QDate SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
    expect(result.host.textContent).toContain('2019')
  })

  test('hydrates cleanly on the current month', async () => {
    const result = await hydrate(fixturesPath, 'currentMonth', currentMonth)

    expect(result.consoleOutput).toEqual([])
  })
})
