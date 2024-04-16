import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import useQuasar from './use-quasar.js'

describe('[useQuasar API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const result = useQuasar()
              return { result }
            }
          })
        )

        expect(
          wrapper.vm.result
        ).toBeTypeOf('object')

        expect(
          Object.keys(wrapper.vm.result)
        ).not.toHaveLength(0)

        expect(
          wrapper.vm.result.version
        ).toMatch(/^\d+\.\d+\.\d+$/)
      })
    })
  })
})
