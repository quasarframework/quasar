import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import {
  basic,
  counters,
  oncePrerendered,
  ssrPrerendered
} from './QIntersection.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QIntersection SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
    // without ssrPrerender the server sends the empty shell
    expect(result.serverHtml).not.toContain('Observed content')
  })

  test('hydrates cleanly with ssrPrerender', async () => {
    const result = await hydrate(fixturesPath, 'ssrPrerendered', ssrPrerendered)

    expect(result.consoleOutput).toEqual([])
    // the whole point of ssrPrerender: content in the server payload
    expect(result.serverHtml).toContain('Prerendered content')
  })

  // last on purpose: takeover() is a test file's final act
  test('once + ssrPrerender content survives the client takeover', async () => {
    const result = await hydrate(
      fixturesPath,
      'oncePrerendered',
      oncePrerendered
    )

    expect(result.consoleOutput).toEqual([])
    expect(result.serverHtml).toContain('Prerendered content')
    expect(counters).toEqual({ setup: 1, mounted: 1, unmounted: 0 })

    await result.takeover()

    // the hydrated DOM and component state must be kept, not thrown
    // away and rebuilt
    expect(counters).toEqual({ setup: 1, mounted: 1, unmounted: 0 })
  })
})
