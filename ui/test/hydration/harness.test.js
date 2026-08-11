import { describe, expect, test } from 'vitest'

import { hydrate } from './hydrate.js'

import { mismatch } from './harness.fixtures.js'

const fixturesPath = import.meta.url

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

  // must stay the LAST test in this file: it performs the takeover
  test('rejects hydrating after the client takeover', async () => {
    const result = await hydrate(fixturesPath, 'mismatch', mismatch)
    await result.takeover()

    await expect(hydrate(fixturesPath, 'mismatch', mismatch)).rejects.toThrow(
      'after the client takeover'
    )
  })
})
