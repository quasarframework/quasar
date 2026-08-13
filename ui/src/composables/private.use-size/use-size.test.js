import { describe, expect, test } from 'vitest'

import {
  createSizeStyle,
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

    describe('[(variable)getSizeStyle]', () => {
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
  })

  describe('[Functions]', () => {
    describe('[(function)createSizeStyle]', () => {
      test('has correct return value', () => {
        const getStyle = createSizeStyle({ xs: 55 })

        expect(getStyle(void 0)).toBeNull()
        expect(getStyle('xs')).toStrictEqual({ fontSize: '55px' })
        expect(getStyle('24px')).toStrictEqual({ fontSize: '24px' })

        // the returned objects are shared and reference-stable,
        // so an unchanged size can skip style patching entirely
        expect(getStyle('24px')).toBe(getStyle('24px'))
      })
    })
  })
})
