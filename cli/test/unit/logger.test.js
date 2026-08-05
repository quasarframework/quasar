import { describe, expect, test } from 'vitest'

import {
  errorPill,
  getError,
  getInfo,
  getSuccess,
  getWarning,
  infoPill,
  successPill,
  warningPill
} from '../../lib/logger.js'

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
})
