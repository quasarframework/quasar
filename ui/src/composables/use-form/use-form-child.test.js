import { mount } from '@vue/test-utils'
import { defineComponent, getCurrentInstance, nextTick } from 'vue'
import { describe, expect, test, vi } from 'vitest'

import { formKey } from '../../utils/private.symbols/symbols.js'
import useFormChild from './use-form-child.js'

describe('[useFormChild API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('binds to QForm, reacts to disable, unbinds, and reports missing QForm', async () => {
        const validate = vi.fn(),
          resetValidation = vi.fn(),
          form = {
            bindComponent: vi.fn(),
            unbindComponent: vi.fn()
          }
        let result, proxy

        const wrapper = mount(
          defineComponent({
            props: {
              disable: Boolean
            },
            setup() {
              proxy = getCurrentInstance().proxy
              result = useFormChild({
                validate,
                resetValidation,
                requiresQForm: true
              })
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

        expect(result).toBeUndefined()
        expect(wrapper.vm.validate).toBe(validate)
        expect(wrapper.vm.resetValidation).toBe(resetValidation)
        expect(form.bindComponent.mock.calls[0][0]).toBe(proxy)

        await wrapper.setProps({ disable: true })

        expect(resetValidation).toHaveBeenCalledTimes(1)
        expect(form.unbindComponent.mock.calls[0][0]).toBe(proxy)

        await wrapper.setProps({ disable: false })
        expect(form.bindComponent).toHaveBeenCalledTimes(2)

        wrapper.unmount()
        expect(form.unbindComponent).toHaveBeenCalledTimes(2)

        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        try {
          mount(
            defineComponent({
              setup() {
                useFormChild({
                  validate,
                  resetValidation,
                  requiresQForm: true
                })
              },
              template: '<div />'
            })
          )
          await nextTick()

          expect(errorSpy).toHaveBeenCalledWith(
            'Parent QForm not found on useFormChild()!'
          )
        } finally {
          errorSpy.mockRestore()
        }
      })
    })
  })
})
