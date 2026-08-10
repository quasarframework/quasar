import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { quasarOptions, rtlPagination } from './Lang.hydration.fixtures.js'

const fixturesPath = 'src/plugins/lang/Lang.hydration.fixtures.js'

describe('Lang plugin SSR hydration', () => {
  test('an RTL language hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'rtlPagination', rtlPagination, {
      quasarOptions
    })

    expect(result.consoleOutput).toEqual([])

    // the lang pack reached the server-emitted <html> attributes and
    // the client converged on them (hydrate() asserts the convergence)
    expect(result.meta.htmlAttrs).toContain('lang=he')
    expect(result.meta.htmlAttrs).toContain('dir=rtl')
    expect(document.documentElement.getAttribute('dir')).toBe('rtl')
  })
})
