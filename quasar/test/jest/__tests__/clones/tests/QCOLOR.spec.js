
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QCOLOR from './../components/QCOLOR.vue'
import { Quasar, QColor } from 'quasar'

describe('generated QColor test', () => {
  const wrapper = mountQuasar(QCOLOR, {
    utils: {
      appError: () => (fn) => fn,
      appSuccess: () => (fn) => fn
    }
  })
  const vm = wrapper.vm

  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })
   it('mounts', () => {
    const localVue = createLocalVue()
    localVue.use(Quasar, { components: { QColor } })
    const wrapper2 = mount(QCOLOR, {
      localVue
    })
  })
})

