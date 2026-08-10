import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QDialog.hydration.fixtures.js'

const fixturesPath = 'src/components/dialog/QDialog.hydration.fixtures.js'

describe('QDialog SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
