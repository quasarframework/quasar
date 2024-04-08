import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import useId from './use-id.js'

describe('[useId API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('useId()', () => {
        const { value: result } = useId()

        expect(result).toBeTruthy()
        expect(result.startsWith('f_')).toBe(true)
      })

      test('useId({})', () => {
        const { value: result } = useId({})

        expect(result).toBeTruthy()
        expect(result.startsWith('f_')).toBe(true)
      })

      test('useId({ getValue })', () => {
        const { value: result } = useId({
          getValue: () => 'MyValue'
        })

        expect(result).toBe('MyValue')
      })

      test('useId({ getValue: () => null })', () => {
        const { value: result } = useId({
          getValue: () => null
        })

        expect(result).toBeTruthy()
        expect(result.startsWith('f_')).toBe(true)
      })

      test('useId({ getValue: () => null, required: true })', () => {
        const { value: result } = useId({
          getValue: () => null,
          required: true
        })

        expect(result).toBeTruthy()
        expect(result.startsWith('f_')).toBe(true)
      })

      test('useId({ getValue: () => null, required: false })', () => {
        const { value: result } = useId({
          getValue: () => null,
          required: false
        })

        expect(result).toBe(null)
      })

      test('can be used in a Component', () => {
        const TestComponent = defineComponent({
          template: '<div />',
          setup () {
            // eslint-disable-next-line
            const result = useId()
            return { result }
          }
        })

        const wrapper = mount(TestComponent)
        expect(wrapper.vm.result.startsWith('f_')).toBe(true)
      })
    })
  })
})
