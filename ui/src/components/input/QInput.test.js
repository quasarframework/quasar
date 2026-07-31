import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import QInput from './QInput.js'

describe('[QInput IME composition]', () => {
  test('defers masking for each composed digit until composition ends', async () => {
    const onUpdateModelValue = vi.fn()
    const wrapper = mount(QInput, {
      props: {
        modelValue: '',
        mask: '####/##/##',
        'onUpdate:modelValue': onUpdateModelValue
      }
    })
    const input = wrapper.get('input')

    for (const [index, value] of ['2', '20', '202', '2023'].entries()) {
      const data = value.at(-1)

      await input.trigger('compositionstart')

      input.element.value = value
      await input.trigger('input', {
        data,
        inputType: 'insertCompositionText'
      })

      expect(onUpdateModelValue).toHaveBeenCalledTimes(index)
      expect(input.element.value).toBe(value)

      await input.trigger('compositionend', { data })
    }

    expect(onUpdateModelValue.mock.calls).toEqual([
      ['2'],
      ['20'],
      ['202'],
      ['2023/']
    ])
    expect(onUpdateModelValue).toHaveBeenLastCalledWith('2023/')
    expect(input.element.value).toBe('2023/')
  })

  test('keeps immediate updates for unmasked compositionstart-only input', async () => {
    const onUpdateModelValue = vi.fn()
    const wrapper = mount(QInput, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': onUpdateModelValue
      }
    })
    const input = wrapper.get('input')

    await input.trigger('compositionstart')

    input.element.value = 'a'
    await input.trigger('input', {
      data: 'a',
      inputType: 'insertCompositionText'
    })

    expect(onUpdateModelValue).toHaveBeenCalledOnce()
    expect(onUpdateModelValue).toHaveBeenLastCalledWith('a')
  })

  test('keeps immediate masking for input outside composition', async () => {
    const onUpdateModelValue = vi.fn()
    const wrapper = mount(QInput, {
      props: {
        modelValue: '',
        mask: '####/##/##',
        'onUpdate:modelValue': onUpdateModelValue
      }
    })
    const input = wrapper.get('input')

    input.element.value = '2023'
    await input.trigger('input', { inputType: 'insertText' })

    expect(onUpdateModelValue).toHaveBeenCalledOnce()
    expect(onUpdateModelValue).toHaveBeenLastCalledWith('2023/')
    expect(input.element.value).toBe('2023/')
  })
})
