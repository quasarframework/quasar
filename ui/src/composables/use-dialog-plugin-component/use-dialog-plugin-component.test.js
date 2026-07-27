import { describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import useDialogPluginComponent from './use-dialog-plugin-component.js'

describe('[useDialogPluginComponent API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        let result

        const wrapper = mount(
          defineComponent({
            template: '<div />',
            emits: useDialogPluginComponent.emits,
            setup() {
              result = useDialogPluginComponent()
              return result
            }
          })
        )

        const dialog = {
          show: vi.fn(),
          hide: vi.fn()
        }
        result.dialogRef.value = dialog

        expect(wrapper.vm.show).toBeTypeOf('function')
        expect(wrapper.vm.hide).toBeTypeOf('function')

        wrapper.vm.show()
        expect(dialog.show).toHaveBeenCalledTimes(1)

        wrapper.vm.hide()
        expect(dialog.hide).toHaveBeenCalledTimes(1)

        result.onDialogOK({ accepted: true })
        expect(wrapper.emitted('ok')).toStrictEqual([[{ accepted: true }]])
        expect(dialog.hide).toHaveBeenCalledTimes(2)

        result.onDialogCancel()
        expect(dialog.hide).toHaveBeenCalledTimes(3)

        result.onDialogHide()
        expect(wrapper.emitted('hide')).toStrictEqual([[]])
      })
    })
  })
})
