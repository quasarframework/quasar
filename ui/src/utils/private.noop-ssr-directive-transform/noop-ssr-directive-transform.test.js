import { describe, test, expect } from 'vitest'

import noopSsrDirectiveTransform from './noop-ssr-directive-transform.js'

describe('[noopSsrDirectiveTransform API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const result = noopSsrDirectiveTransform()
        expect(result).toStrictEqual({})
      })
    })
  })
})
