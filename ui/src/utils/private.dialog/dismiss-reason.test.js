import { describe, expect, test } from 'vitest'

import { getDismissReason } from './dismiss-reason.js'

describe('[dismissReason API]', () => {
  describe('[Functions]', () => {
    describe('[(function)getDismissReason]', () => {
      test('has correct return value', () => {
        expect(getDismissReason()).toBe('programmatic')
        expect(getDismissReason(new KeyboardEvent('keyup'))).toBe('escape')
        expect(getDismissReason(new KeyboardEvent('keydown'))).toBe('escape')
        expect(getDismissReason(new MouseEvent('mousedown'))).toBe('backdrop')
        expect(getDismissReason(new MouseEvent('click'))).toBe('backdrop')
      })
    })
  })
})
