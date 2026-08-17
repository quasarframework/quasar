import { afterEach, describe, expect, test, vi } from 'vitest'

import {
  enterAlternateScreen,
  errorPill,
  exitAlternateScreen,
  getError,
  getInfo,
  getSuccess,
  getWarning,
  infoPill,
  successPill,
  waitForKey,
  warningPill
} from './logger.js'

describe('[logger.js]', () => {
  test('pills wrap the message in padding', () => {
    for (const pill of [successPill, infoPill, errorPill, warningPill]) {
      expect(pill('MSG')).toContain(' MSG ')
    }
  })

  test.each([
    ['getSuccess', getSuccess],
    ['getInfo', getInfo],
    ['getError', getError],
    ['getWarning', getWarning]
  ])('%s() renders the title and message', (_, fn) => {
    const banner = fn('the message', 'TITLE')
    expect(banner).toContain('the message')
    expect(banner).toContain('TITLE')
    expect(banner).toContain('Global Quasar CLI')
  })

  // the interactive (TTY) flavors of the helpers below are not covered:
  // they take over the terminal and wait for a key press
  describe('non-TTY stdio', () => {
    const originalStdinTTY = process.stdin.isTTY
    const originalStdoutTTY = process.stdout.isTTY

    afterEach(() => {
      process.stdin.isTTY = originalStdinTTY
      process.stdout.isTTY = originalStdoutTTY
      vi.restoreAllMocks()
    })

    test('the alternate screen emits nothing when stdout is piped', () => {
      process.stdout.isTTY = false

      const writeSpy = vi
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true)
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      enterAlternateScreen('starting task')
      exitAlternateScreen()

      expect(writeSpy).not.toHaveBeenCalled()
      expect(logSpy).not.toHaveBeenCalled()
    })

    test('waitForKey() resolves right away when stdin is piped', async () => {
      process.stdin.isTTY = false

      const writeSpy = vi
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true)

      // a piped stdin has no setRawMode(), so the interactive path would
      // throw and mask whatever error the caller is reporting
      await expect(waitForKey()).resolves.toBeUndefined()
      expect(writeSpy).not.toHaveBeenCalled()
    })
  })
})
