import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QStepper.hydration.fixtures.js'

const fixturesPath = 'src/components/stepper/QStepper.hydration.fixtures.js'

describe('QStepper SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
