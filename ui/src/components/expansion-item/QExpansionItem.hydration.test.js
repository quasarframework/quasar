import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import {
  basic,
  defaultOpened,
  setupApp,
  withTo
} from './QExpansionItem.hydration.fixtures.js'

const fixturesPath =
  'src/components/expansion-item/QExpansionItem.hydration.fixtures.js'

describe('QExpansionItem SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic, { setupApp })

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly with a router-link header', async () => {
    const result = await hydrate(fixturesPath, 'withTo', withTo, { setupApp })

    expect(result.consoleOutput).toEqual([])
    // its header item server-rendered as an actual link
    expect(result.serverHtml).toContain('href="/target"')
  })

  test('hydrates cleanly when opened by default', async () => {
    const result = await hydrate(fixturesPath, 'defaultOpened', defaultOpened, {
      setupApp
    })

    expect(result.consoleOutput).toEqual([])
    // the expanded content was in the server payload
    expect(result.serverHtml).toContain('Opened content')
  })
})
