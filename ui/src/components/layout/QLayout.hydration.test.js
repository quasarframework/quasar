import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import {
  basic,
  container,
  drawerShowIfAbove
} from './QLayout.hydration.fixtures.js'

const fixturesPath = 'src/components/layout/QLayout.hydration.fixtures.js'

describe('QLayout SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly in container mode', async () => {
    const result = await hydrate(fixturesPath, 'container', container)

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly with a show-if-above drawer', async () => {
    const result = await hydrate(
      fixturesPath,
      'drawerShowIfAbove',
      drawerShowIfAbove
    )

    expect(result.consoleOutput).toEqual([])
  })
})
