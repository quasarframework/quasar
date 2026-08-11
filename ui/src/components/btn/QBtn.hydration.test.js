import { describe, expect, test } from 'vitest'

import { isRuntimeSsrPreHydration } from 'quasar/src/plugins/platform/Platform.js'
import { hydrate } from 'testing/hydration/hydrate.js'

import {
  basic,
  setupApp,
  stateVariants,
  withTo
} from './QBtn.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QBtn SSR hydration', () => {
  test('hydrates cleanly as a router link', async () => {
    const result = await hydrate(fixturesPath, 'withTo', withTo, { setupApp })

    expect(result.consoleOutput).toEqual([])
    // it server-rendered as an actual link
    expect(result.serverHtml).toContain('href="/target"')
  })

  test('hydrates cleanly across state variants', async () => {
    const result = await hydrate(fixturesPath, 'stateVariants', stateVariants, {
      setupApp
    })

    expect(result.consoleOutput).toEqual([])
  })

  // keep last: takeover flips the graph out of its pre-hydration state
  test('hydrates cleanly, then the client takeover completes', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic, { setupApp })

    expect(result.consoleOutput).toEqual([])
    expect(result.host.textContent).toContain('Hydrate me')

    expect(isRuntimeSsrPreHydration.value).toBe(true)
    await result.takeover()
    expect(isRuntimeSsrPreHydration.value).toBe(false)
  })
})
