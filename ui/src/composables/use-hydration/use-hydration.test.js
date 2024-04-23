import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import useHydration from './use-hydration.js'

describe('[useHydration API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const result = useHydration()
              return { result }
            }
          })
        )

        expect(
          wrapper.vm.result.isHydrated
        ).$ref(true)
      })
    })
  })
})
