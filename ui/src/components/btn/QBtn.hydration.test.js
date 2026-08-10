import { describe, expect, test } from 'vitest'

import { isRuntimeSsrPreHydration } from 'quasar/src/plugins/platform/Platform.js'
import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QBtn.hydration.fixtures.js'

const fixturesPath = 'src/components/btn/QBtn.hydration.fixtures.js'

describe('QBtn SSR hydration', () => {
  test('hydrates cleanly, then the client takeover completes', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
    expect(result.host.textContent).toContain('Hydrate me')

    expect(isRuntimeSsrPreHydration.value).toBe(true)
    await result.takeover()
    expect(isRuntimeSsrPreHydration.value).toBe(false)
  })
})
