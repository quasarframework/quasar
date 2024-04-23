import { describe, test, expect } from 'vitest'

import useDark, { useDarkProps } from './use-dark.js'

describe('[useDark API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useDarkProps]', () => {
      test('is defined correctly', () => {
        expect(useDarkProps).toBeTypeOf('object')
        expect(Object.keys(useDarkProps)).not.toHaveLength(0)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        expect(
          useDark({}, {})
        ).$ref()
      })

      test('keeps account of $q.dark when prop is null', () => {
        const $q = {
          dark: {
            isActive: true
          }
        }

        expect(
          useDark({ dark: null }, $q)
        ).$ref(true)

        $q.dark.isActive = false

        expect(
          useDark({ dark: null }, $q)
        ).$ref(false)
      })

      test('returns prop value regardless of $q.dark', () => {
        const $q = {
          dark: {
            isActive: true
          }
        }

        expect(
          useDark({ dark: true }, $q)
        ).$ref(true)

        expect(
          useDark({ dark: false }, $q)
        ).$ref(false)

        $q.dark.isActive = false

        expect(
          useDark({ dark: true }, $q)
        ).$ref(true)

        expect(
          useDark({ dark: false }, $q)
        ).$ref(false)
      })
    })
  })
})
