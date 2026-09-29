import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, vertical } from './QBtnGroup.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QBtnGroup SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly when vertical', async () => {
    const result = await hydrate(fixturesPath, 'vertical', vertical)

    expect(result.consoleOutput).toEqual([])
    expect(result.serverHtml).toContain('q-btn-group--vertical')
  })
})
