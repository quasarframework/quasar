import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import Cookies from './Cookies.js'
import {
  MISSING_COOKIE,
  STORED_COOKIE,
  missing,
  quasarOptions,
  stored
} from './Cookies.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('Cookies SSR hydration', () => {
  beforeEach(() => {
    // what the request headers of the fixtures carry
    Cookies.set(STORED_COOKIE, 'dark')
  })

  afterEach(() => {
    Cookies.remove(STORED_COOKIE)
    Cookies.remove(MISSING_COOKIE)
  })

  test('useCookie() renders the request cookie on both sides', async () => {
    const result = await hydrate(fixturesPath, 'stored', stored, {
      quasarOptions
    })

    expect(result.consoleOutput).toEqual([])
    expect(result.serverHtml).toContain('dark')
    expect(result.host.textContent).toBe('dark')
  })

  test('useCookie() renders the default of a missing cookie on both sides, then stores it', async () => {
    const result = await hydrate(fixturesPath, 'missing', missing, {
      quasarOptions
    })

    expect(result.consoleOutput).toEqual([])
    expect(result.serverHtml).toContain('light')
    expect(result.host.textContent).toBe('light')

    // the client attached to the missing cookie and stored the default
    expect(Cookies.get(MISSING_COOKIE)).toBe('light')

    await result.takeover()
    expect(result.host.textContent).toBe('light')
  })
})
