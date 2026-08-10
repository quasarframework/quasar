import { describe, expect, test } from 'vitest'

import { hydrate } from './hydrate.js'

import {
  darkCard,
  quasarOptions,
  rtlPagination
} from './quasar-config.fixtures.js'

const fixturesPath = 'test/hydration/quasar-config.fixtures.js'

describe('Quasar config SSR hydration', () => {
  test('dark mode reaches the server render and hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'darkCard', darkCard, {
      quasarOptions
    })

    expect(result.consoleOutput).toEqual([])

    // the dark config drove the SERVER markup, not just the client
    expect(result.serverHtml).toContain('q-card--dark')
  })

  test('an RTL language hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'rtlPagination', rtlPagination, {
      quasarOptions
    })

    expect(result.consoleOutput).toEqual([])
  })
})
