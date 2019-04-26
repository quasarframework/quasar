
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QSPINNERRADIO from './../components/QSPINNERRADIO.vue'
import { Quasar, QSpinnerRadio } from 'quasar'

describe('generated QSpinnerRadio test', () => {
  const wrapper = mountQuasar(QSPINNERRADIO, {
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
    localVue.use(Quasar, { components: { QSpinnerRadio } })
    const wrapper2 = mount(QSPINNERRADIO, {
      localVue
    })
  })
})

