import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, horizontal } from './QVirtualScroll.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QVirtualScroll SSR hydration', () => {
  test('hydrates cleanly with the initial window server-rendered', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
    // the initial window is in the server payload, the tail is not
    expect(result.serverHtml).toContain('Item #0')
    expect(result.serverHtml).not.toContain('Item #49')
  })

  test('hydrates cleanly in horizontal mode', async () => {
    const result = await hydrate(fixturesPath, 'horizontal', horizontal)

    expect(result.consoleOutput).toEqual([])
    expect(result.serverHtml).toContain('Item #0')
    expect(result.serverHtml).not.toContain('Item #49')
  })
})
