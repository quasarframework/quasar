import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, errorState } from './QFile.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QFile SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly across errorState', async () => {
    const result = await hydrate(fixturesPath, 'errorState', errorState)

    expect(result.consoleOutput).toEqual([])
    expect(result.serverHtml).toContain('Please attach a file')
  })
})
