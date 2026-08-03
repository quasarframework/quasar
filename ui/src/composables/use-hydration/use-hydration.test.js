import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import useHydration from './use-hydration.js'

describe('[useHydration API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        const wrapper = mount(
          defineComponent({
            render: () => h('div'),
            setup() {
              const result = useHydration()
              return { result }
            }
          })
        )

        expect(wrapper.vm.result.isHydrated).$ref(true)
      })
    })
  })
})
