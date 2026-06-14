import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, test } from 'vitest'

import QField from './QField.js'

describe('[QField API]', () => {
  describe('[Accessibility]', () => {
    test('passes error ARIA values to custom control slots', () => {
      const wrapper = mount(QField, {
        props: {
          modelValue: '',
          error: true,
          errorMessage: 'Choose a value'
        },
        slots: {
          control: scope =>
            h('input', {
              id: scope.id,
              'aria-invalid': scope.ariaInvalid,
              'aria-describedby': scope.ariaDescribedby,
              'aria-errormessage': scope.ariaErrormessage
            })
        }
      })

      const input = wrapper.get('input')
      const messageId = wrapper.get('.q-field__messages').attributes('id')

      expect(input.attributes('aria-invalid')).toBe('true')
      expect(input.attributes('aria-describedby')).toBe(messageId)
      expect(input.attributes('aria-errormessage')).toBe(messageId)
    })
  })
})
