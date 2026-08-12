import { describe, expect, test } from 'vitest'

import useSize, {
  getSizeStyle,
  useSizeDefaults,
  useSizeProps
} from './use-size.js'

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
        expect(useSizeProps).$props()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)getSizeStyle]', () => {
      test('has correct return value', () => {
        expect(getSizeStyle(void 0)).toBeNull()

        expect(getSizeStyle('24px')).toStrictEqual({ fontSize: '24px' })

        expect(getSizeStyle('sm')).toStrictEqual({
          fontSize: `${useSizeDefaults.sm}px`
        })

        // the returned objects are shared and reference-stable,
        // so an unchanged size can skip style patching entirely
        expect(getSizeStyle('24px')).toBe(getSizeStyle('24px'))
      })
    })

    describe('[(function)default]', () => {
      test('should set the size', () => {
        const { value } = useSize({ size: '24px' })
        expect(value.fontSize).toBe('24px')
      })

      test('should set the size with standard size names', () => {
        const { value } = useSize({ size: 'sm' })
        expect(value.fontSize).toBe(`${useSizeDefaults.sm}px`)
      })

      test('should set the size with custom size names', () => {
        const { value } = useSize({ size: 'xs' }, { xs: 55 })
        expect(value.fontSize).toBe('55px')
      })
    })
  })
})
