import { describe, expect, test } from 'vitest'

import {
  getSpinnerClass,
  getSpinnerSize,
  useSpinnerProps
} from './spinner-utils.js'
import { useSizeDefaults } from 'quasar/src/composables/private.use-size/use-size.js'

describe('[spinnerUtils API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useSpinnerProps]', () => {
      test('is defined correctly', () => {
        expect(useSpinnerProps).$props()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)getSpinnerSize]', () => {
      test('has correct return value when size is missing', () => {
        expect(getSpinnerSize(void 0)).toBeUndefined()
      })

      test('has correct return value when size has unit', () => {
        expect(getSpinnerSize('2em')).toBe('2em')
      })

      test('has correct return value when size is xl', () => {
        expect(getSpinnerSize('xl')).toBe(`${useSizeDefaults.xl}px`)
      })
    })

    describe('[(function)getSpinnerClass]', () => {
      test('has correct return value when color is missing', () => {
        expect(getSpinnerClass(void 0)).toBe('q-spinner')
      })

      test('has correct return value when color is defined', () => {
        expect(getSpinnerClass('red')).toBe('q-spinner text-red')
      })
    })
  })
})
