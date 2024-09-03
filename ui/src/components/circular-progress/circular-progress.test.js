import { describe, test, expect } from 'vitest'

import { useCircularCommonProps } from './circular-progress.js'

describe('[circularProgress API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useCircularCommonProps]', () => {
      test('is defined correctly', () => {
        expect(useCircularCommonProps).toBeTypeOf('object')
        expect(Object.keys(useCircularCommonProps)).not.toHaveLength(0)
      })
    })
  })
})
