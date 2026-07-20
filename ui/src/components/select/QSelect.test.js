import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QSelect from './QSelect.js'

describe('[QSelect API]', () => {
  describe('[Accessibility]', () => {
    test.each([false, true])(
      'exposes error state and message relationship when useInput is %s',
      useInput => {
        const wrapper = mount(QSelect, {
          props: {
            modelValue: null,
            options: ['One', 'Two'],
            useInput,
            error: true,
            errorMessage: 'Choose an option'
          }
        })

        const input = wrapper.get('input[role="combobox"]')
        const message = wrapper.get('.q-field__messages')
        const messageId = message.attributes('id')

        expect(message.text()).toBe('Choose an option')
        expect(messageId).toBeTruthy()
        expect(input.attributes('aria-invalid')).toBe('true')
        expect(input.attributes('aria-errormessage')).toBe(messageId)
        expect(input.attributes('aria-describedby')?.split(' ')).toContain(
          messageId
        )
      }
    )

    test('preserves explicit ARIA references', () => {
      const wrapper = mount(QSelect, {
        attrs: {
          'aria-describedby': 'external-help',
          'aria-errormessage': 'external-error'
        },
        props: {
          modelValue: null,
          options: ['One', 'Two'],
          error: true,
          errorMessage: 'Choose an option'
        }
      })

      const input = wrapper.get('input[role="combobox"]')
      const messageId = wrapper.get('.q-field__messages').attributes('id')

      expect(input.attributes('aria-errormessage')).toBe('external-error')
      expect(input.attributes('aria-describedby')?.split(' ')).toEqual([
        'external-help',
        messageId
      ])
    })
  })
})
