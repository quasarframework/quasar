// oxlint-disable import/no-named-as-default-member

import { afterEach, describe, expect, test } from 'vitest'

import { getWeekOfYear } from './date.js'

describe('[date API]', () => {
  describe('[Functions]', () => {
    describe('[(function)getWeekOfYear]', () => {
      const originalTZ = process.env.TZ
      afterEach(() => {
        process.env.TZ = originalTZ
      })

      // Mon 8 Apr 2024 is ISO week 15 (Jan 1 2024 is a Monday).
      test('is correct across a DST switch (southern hemisphere)', () => {
        process.env.TZ = 'Australia/Sydney' // January in DST, April not
        expect(getWeekOfYear(new Date(2024, 3, 8, 12, 0, 0))).toBe(15)
      })

      test('is correct in a northern-hemisphere zone', () => {
        process.env.TZ = 'America/New_York'
        expect(getWeekOfYear(new Date(2024, 3, 8, 12, 0, 0))).toBe(15)
      })
    })
  })
})
