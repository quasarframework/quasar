import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QBreadcrumbs.hydration.fixtures.js'

const fixturesPath =
  'src/components/breadcrumbs/QBreadcrumbs.hydration.fixtures.js'

describe('QBreadcrumbs SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
