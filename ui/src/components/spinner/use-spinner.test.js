import { describe, test, expect } from 'vitest'

import useSpinner, { useSpinnerProps } from './use-spinner.js'
import { useSizeDefaults } from 'quasar/src/composables/private.use-size/use-size.js'

describe('[useSpinner API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useSpinnerProps]', () => {
      test('is defined correctly', () => {
        expect(useSpinnerProps).toBeTypeOf('object')
        expect(Object.keys(useSpinnerProps)).not.toHaveLength(0)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value when missing props', () => {
        const result = useSpinner({})
        expect(result).toStrictEqual({
          cSize: expect.$ref(void 0),
          classes: expect.$ref('q-spinner')
        })
      })

      test('has correct return value when props.size has unit', () => {
        const result = useSpinner({ size: '2em' })
        expect(result).toStrictEqual({
          cSize: expect.$ref('2em'),
          classes: expect.$ref('q-spinner')
        })
      })

      test('has correct return value when props.size is xl', () => {
        const result = useSpinner({ size: 'xl' })
        expect(result).toStrictEqual({
          cSize: expect.$ref(`${ useSizeDefaults.xl }px`),
          classes: expect.$ref('q-spinner')
        })
      })

      test('has correct return value when props.color is defined', () => {
        const result = useSpinner({ color: 'red' })
        expect(result).toStrictEqual({
          cSize: expect.$ref(void 0),
          classes: expect.$ref('q-spinner text-red')
        })
      })

      test('has correct return value when props.size & props.color are defined', () => {
        const result = useSpinner({ size: '500em', color: 'bogus-color' })
        expect(result).toStrictEqual({
          cSize: expect.$ref('500em'),
          classes: expect.$ref('q-spinner text-bogus-color')
        })
      })
    })
  })
})
