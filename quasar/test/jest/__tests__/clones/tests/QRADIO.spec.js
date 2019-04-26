
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QRADIO from './../components/QRADIO.vue'
import { Quasar, QRadio } from 'quasar'

describe('generated QRadio test', () => {
  const wrapper = mountQuasar(QRADIO, {
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
    localVue.use(Quasar, { components: { QRadio } })
    const wrapper2 = mount(QRADIO, {
      localVue
    })
  })
})

