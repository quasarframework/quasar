import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QInput from './QInput.js'

describe('[QInput API]', () => {
  describe('[Accessibility]', () => {
    test('exposes error state and message relationship on the native control', () => {
      const wrapper = mount(QInput, {
        props: {
          modelValue: '',
          label: 'Email',
          error: true,
          errorMessage: 'Email is required'
        }
      })

      const input = wrapper.get('input')
      const message = wrapper.get('.q-field__messages')
      const messageId = message.attributes('id')

      expect(message.text()).toBe('Email is required')
      expect(messageId).toBeTruthy()
      expect(input.attributes('aria-invalid')).toBe('true')
      expect(input.attributes('aria-errormessage')).toBe(messageId)
      expect(input.attributes('aria-describedby')?.split(' ')).toContain(
        messageId
      )
    })

    test('preserves existing aria-describedby values when adding the error message', () => {
      const wrapper = mount(QInput, {
        attrs: {
          'aria-describedby': 'external-help'
        },
        props: {
          modelValue: '',
          error: true,
          errorMessage: 'Required'
        }
      })

      const describedBy = wrapper.get('input').attributes('aria-describedby')
      const messageId = wrapper.get('.q-field__messages').attributes('id')

      expect(describedBy?.split(' ')).toEqual(['external-help', messageId])
    })

    test('preserves an explicit aria-errormessage value', () => {
      const wrapper = mount(QInput, {
        attrs: {
          'aria-errormessage': 'external-error'
        },
        props: {
          modelValue: '',
          error: true,
          errorMessage: 'Required'
        }
      })

      expect(wrapper.get('input').attributes('aria-errormessage')).toBe(
        'external-error'
      )
    })
  })
})
