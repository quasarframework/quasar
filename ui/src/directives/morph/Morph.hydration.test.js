import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { group } from './Morph.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('Morph directive SSR hydration', () => {
  test('hydrates a morph group cleanly', async () => {
    const result = await hydrate(fixturesPath, 'group', group)

    expect(result.consoleOutput).toEqual([])

    // the non-active member was server-rendered invisible...
    expect(result.serverHtml).toContain('q-morph--invisible')

    // ...and stays so after hydration, the active one visible
    const [active, hidden] = result.host.firstChild.children
    expect(active.classList.contains('q-morph--invisible')).toBe(false)
    expect(hidden.classList.contains('q-morph--invisible')).toBe(true)
  })
})
