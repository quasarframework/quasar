import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { darkCard, quasarOptions } from './Dark.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('Dark plugin SSR hydration', () => {
  test('dark mode reaches the server render and hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'darkCard', darkCard, {
      quasarOptions
    })

    expect(result.consoleOutput).toEqual([])

    // the dark config drove the SERVER markup and body classes, not
    // just the client (hydrate() asserts the client converges on them)
    expect(result.serverHtml).toContain('q-card--dark')
    expect(result.meta.bodyClasses).toContain('body--dark')
  })
})
