import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, test, vi } from 'vitest'

import { formKey } from '../../utils/private.symbols/symbols.js'
import QFormChildMixin from './QFormChildMixin.js'

function mountFormChild(form) {
  return mount(
    defineComponent({
      mixins: [QFormChildMixin],
      props: {
        disable: Boolean
      },
      template: '<div />'
    }),
    {
      global: {
        provide: {
          [formKey]: form
        }
      }
    }
  )
}

describe('[QFormChildMixin API]', () => {
  describe('[Methods]', () => {
    describe('[(method)validate]', () => {
      test('should be callable', async () => {
        const form = {
          bindComponent: vi.fn(),
          unbindComponent: vi.fn()
        }
        const wrapper = mountFormChild(form)

        expect(wrapper.vm.validate()).toBeUndefined()
        expect(form.bindComponent.mock.calls[0][0]).toBe(wrapper.vm)

        await wrapper.setProps({ disable: true })
        expect(form.unbindComponent.mock.calls[0][0]).toBe(wrapper.vm)

        await wrapper.setProps({ disable: false })
        expect(form.bindComponent).toHaveBeenCalledTimes(2)
      })
    })

    describe('[(method)resetValidation]', () => {
      test('should be callable', async () => {
        const form = {
          bindComponent: vi.fn(),
          unbindComponent: vi.fn()
        }
        const wrapper = mountFormChild(form)
        const resetValidation = vi.spyOn(wrapper.vm, 'resetValidation')

        expect(wrapper.vm.resetValidation()).toBeUndefined()

        await wrapper.setProps({ disable: true })
        expect(resetValidation).toHaveBeenCalledTimes(2)

        await wrapper.setProps({ disable: false })
        wrapper.unmount()

        expect(form.unbindComponent.mock.calls.at(-1)[0]).toBe(wrapper.vm)
      })
    })
  })
})
