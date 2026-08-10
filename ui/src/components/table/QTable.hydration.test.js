import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, virtualScroll } from './QTable.hydration.fixtures.js'

const fixturesPath = 'src/components/table/QTable.hydration.fixtures.js'

describe('QTable SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly in virtual-scroll mode', async () => {
    const result = await hydrate(fixturesPath, 'virtualScroll', virtualScroll)

    expect(result.consoleOutput).toEqual([])
    // the initial window of rows is in the server payload, the tail
    // is not
    expect(result.serverHtml).toContain('Row #0')
    expect(result.serverHtml).not.toContain('Row #39')
  })
})
