import { describe, expect, test } from 'vitest'

import { hydrate } from './hydrate.js'

import { mismatch } from './harness.fixtures.js'

const fixturesPath = 'test/hydration/harness.fixtures.js'

describe('hydration harness self-test', () => {
  test('surfaces Vue hydration mismatch warnings', async () => {
    const { consoleOutput, host } = await hydrate(
      fixturesPath,
      'mismatch',
      mismatch
    )

    expect(consoleOutput.some(msg => /hydration|mismatch/i.test(msg))).toBe(
      true
    )

    // Vue recovers from the mismatch by patching in the client render
    expect(host.textContent).toBe('client text')
  })
})
