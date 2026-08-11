import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QNoSsr.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QNoSsr SSR hydration', () => {
  test('hydrates the placeholder cleanly, then swaps in the client content', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])

    // the server sent the placeholder...
    expect(result.serverHtml).toContain('Server placeholder')

    // ...and the client swapped in the real content on mount
    expect(result.host.textContent).toBe('Client only content')
  })
})
