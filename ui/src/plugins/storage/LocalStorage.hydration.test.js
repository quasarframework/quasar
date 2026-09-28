import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import LocalStorage from './LocalStorage.js'
import { STORAGE_KEY, items } from './LocalStorage.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('LocalStorage SSR hydration', () => {
  beforeEach(() => {
    // the server renders with nothing in store, so a stored value must
    // not land before the markup is hydrated
    LocalStorage.setItem(STORAGE_KEY, 'dark')
  })

  afterEach(() => {
    LocalStorage.removeItem(STORAGE_KEY)
  })

  test('items reads as empty until the client takeover', async () => {
    const result = await hydrate(fixturesPath, 'items', items)

    expect(result.consoleOutput).toEqual([])
    expect(result.serverHtml).toContain('null')
    expect(result.host.textContent).toBe('null')

    await result.takeover()
    expect(result.host.textContent).toBe('dark')
  })
})
