import { describe, expect, test } from 'vitest'

import useDark, { useDarkProps } from './use-dark.js'

describe('[useDark API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useDarkProps]', () => {
      test('is defined correctly', () => {
        expect(useDarkProps).$props()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        expect(useDark({}, {})).toBeTypeOf('function')
      })

      test('keeps account of $q.dark when prop is null', () => {
        const $q = {
          dark: {
            isActive: true
          }
        }

        const isDark = useDark({ dark: null }, $q)
        expect(isDark()).toBe(true)

        $q.dark.isActive = false

        expect(isDark()).toBe(false)
      })

      test('returns prop value regardless of $q.dark', () => {
        const $q = {
          dark: {
            isActive: true
          }
        }

        expect(useDark({ dark: true }, $q)()).toBe(true)

        expect(useDark({ dark: false }, $q)()).toBe(false)

        $q.dark.isActive = false

        expect(useDark({ dark: true }, $q)()).toBe(true)

        expect(useDark({ dark: false }, $q)()).toBe(false)
      })
    })
  })
})
