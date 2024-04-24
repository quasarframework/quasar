import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'

import 'quasar/src/css/index.sass'

import { QToolbar } from 'quasar'
import PaddingTest from 'playground/sass-transform/PaddingTest.vue'

describe('Sass Transform', () => {
  test('variables file is taken into account', () => {
    const wrapper = mount(QToolbar)

    const { element } = wrapper.get('div')
    expect(
      window.getComputedStyle(element)
        .getPropertyValue('padding')
    ).toBe('100px')
  })

  test('correctly uses sass variables', () => {
    const wrapper = mount(PaddingTest)

    const { element } = wrapper.get('div.my-div')
    expect(
      window.getComputedStyle(element)
        .getPropertyValue('padding')
    ).toBe('100px')
  })
})
