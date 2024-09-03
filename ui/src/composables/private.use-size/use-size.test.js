import { describe, test, expect } from 'vitest'

import useSize, { useSizeDefaults, useSizeProps } from './use-size.js'

describe('[useSize API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useSizeDefaults]', () => {
      test('is defined correctly', () => {
        expect(useSizeDefaults).toBeTypeOf('object')
        expect(Object.keys(useSizeDefaults)).not.toHaveLength(0)
      })
    })

    describe('[(variable)useSizeProps]', () => {
      test('is defined correctly', () => {
        expect(useSizeProps).toBeTypeOf('object')
        expect(Object.keys(useSizeProps)).not.toHaveLength(0)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('should set the size', () => {
        const { value } = useSize({ size: '24px' })
        expect(value.fontSize).toBe('24px')
      })

      test('should set the size with standard size names', () => {
        const { value } = useSize({ size: 'sm' })
        expect(value.fontSize).toBe(`${ useSizeDefaults.sm }px`)
      })

      test('should set the size with custom size names', () => {
        const { value } = useSize({ size: 'xs' }, { xs: 55 })
        expect(value.fontSize).toBe('55px')
      })
    })
  })
})
