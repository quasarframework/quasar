import { describe, test, expect } from 'vitest'

import useRatio, { useRatioProps } from './use-ratio.js'

describe('[useRatio API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useRatioProps]', () => {
      test('is defined correctly', () => {
        expect(useRatioProps).toBeTypeOf('object')
        expect(Object.keys(useRatioProps)).not.toHaveLength(0)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('should return padding when ratio is supplied', () => {
        const { value } = useRatio({ ratio: 2 })
        expect(value).toBeTypeOf('object')
        expect(value.paddingBottom).toBeTruthy()
      })

      test('should return padding when naturalRatio is supplied', () => {
        const { value } = useRatio({}, { value: 2 })
        expect(value).toBeTypeOf('object')
        expect(value.paddingBottom).toBeTruthy()
      })

      test('should not return padding when invalid params', () => {
        const { value } = useRatio({ ratio: 'a' })
        expect(value).toBeNull()
      })

      test('should not return padding when no params are supplied', () => {
        const { value } = useRatio({})
        expect(value).toBeNull()
      })
    })
  })
})
