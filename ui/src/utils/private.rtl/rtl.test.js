import { describe, test, expect } from 'vitest'

import { rtlHasScrollBug } from './rtl.js'

describe('[rtl API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)rtlHasScrollBug]', () => {
      test('is defined correctly', () => {
        expect(rtlHasScrollBug).toBeTypeOf('boolean')
      })
    })
  })
})
