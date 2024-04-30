import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import useId from './use-id.js'

const uidRE = /^f_/

describe('[useId API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('useId()', () => {
        const { value: result } = useId()
        expect(result).toMatch(uidRE)
      })

      test('useId({})', () => {
        const { value: result } = useId({})
        expect(result).toMatch(uidRE)
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

        expect(result).toMatch(uidRE)
      })

      test('useId({ getValue: () => null, required: true })', () => {
        const { value: result } = useId({
          getValue: () => null,
          required: true
        })

        expect(result).toMatch(uidRE)
      })

      test('useId({ getValue: () => null, required: false })', () => {
        const { value: result } = useId({
          getValue: () => null,
          required: false
        })

        expect(result).toBeNull()
      })

      test('can be used in a Vue Component', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const result = useId()
              return { result }
            }
          })
        )

        expect(wrapper.vm.result).toMatch(/^f_/)
      })
    })
  })
})
