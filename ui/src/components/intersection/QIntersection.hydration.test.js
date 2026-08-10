import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, ssrPrerendered } from './QIntersection.hydration.fixtures.js'

const fixturesPath =
  'src/components/intersection/QIntersection.hydration.fixtures.js'

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
})
