import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, quasarOptions } from './Screen.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('Screen plugin SSR hydration', () => {
  // single test, takeover last: it flips the graph's pre-hydration
  // state (see the harness contract)
  test('server-renders screen--xs, corrected on takeover', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic, {
      quasarOptions
    })

    expect(result.consoleOutput).toEqual([])
    // the server cannot know the viewport: it emits the xs class
    // (hydrate() asserts the client leaves it in place until takeover)
    expect(result.meta.bodyClasses).toContain('screen--xs')

    await result.takeover()

    // the 1280px viewport resolves to md once the client takes over
    expect(document.body.classList.contains('screen--md')).toBe(true)
    expect(document.body.classList.contains('screen--xs')).toBe(false)
  })
})
