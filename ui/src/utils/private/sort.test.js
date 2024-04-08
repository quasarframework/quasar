import { describe, test, expect } from 'vitest'

import { sortDate, sortBoolean } from './sort.js'

describe('[sort API]', () => {
  describe('[Functions]', () => {
    describe('[(function)sortDate]', () => {
      test('has correct return value', () => {
        const a = new Date(10)
        const b = new Date()
        expect(sortDate(a, b)).toBeLessThan(0)
        expect(sortDate(b, a)).toBeGreaterThan(0)
        expect(sortDate(a, a)).toBe(0)
      })
    })

    describe('[(function)sortBoolean]', () => {
      test('has correct return value', () => {
        expect(sortBoolean(false, true)).toBeGreaterThan(0)
        expect(sortBoolean(true, false)).toBeLessThan(0)
        expect(sortBoolean(true, true)).toBe(0)
      })
    })
  })
})
