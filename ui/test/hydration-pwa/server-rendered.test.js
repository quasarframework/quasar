// keep this the first import — it selects the server-rendered boot
// mode for this file's whole module graph (see its comment); the
// side-effect import IS the mechanism, a call would run too late
// oxlint-disable-next-line import/no-unassigned-import
import './server-rendered-flag.js'

import { describe, expect, test } from 'vitest'

import { isRuntimeSsrPreHydration } from 'quasar/src/plugins/platform/Platform.js'
import { hydrate } from 'testing/hydration/hydrate.js'

import { basic as noSsrBasic } from 'quasar/src/components/no-ssr/QNoSsr.hydration.fixtures.js'
import {
  basic as btnBasic,
  setupApp
} from 'quasar/src/components/btn/QBtn.hydration.fixtures.js'

const noSsrPath = 'src/components/no-ssr/QNoSsr.hydration.fixtures.js'
const btnPath = 'src/components/btn/QBtn.hydration.fixtures.js'

// With the data-server-rendered attribute present at boot, the PWA
// gate must degenerate to the exact hydration semantics the main
// suite pins — proven on representative fixtures reused from it.
describe('PWA SSR hydration — server-rendered boot', () => {
  test('boots in pre-hydration mode via the body attribute', () => {
    expect(isRuntimeSsrPreHydration.value).toBe(true)
  })

  test('QNoSsr hydrates its placeholder, then swaps in the content', async () => {
    const result = await hydrate(noSsrPath, 'basic', noSsrBasic)

    expect(result.consoleOutput).toEqual([])
    expect(result.serverHtml).toContain('Server placeholder')
    expect(result.host.textContent).toBe('Client only content')
  })

  // keep last: takeover flips the graph out of its pre-hydration state
  test('QBtn hydrates cleanly, then the client takeover completes', async () => {
    const result = await hydrate(btnPath, 'basic', btnBasic, { setupApp })

    expect(result.consoleOutput).toEqual([])

    await result.takeover()
    expect(isRuntimeSsrPreHydration.value).toBe(false)
  })
})
