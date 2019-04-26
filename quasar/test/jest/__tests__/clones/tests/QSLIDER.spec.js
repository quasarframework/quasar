
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QSLIDER from './../components/QSLIDER.vue'
import { Quasar, QSlider } from 'quasar'

describe('generated QSlider test', () => {
  const wrapper = mountQuasar(QSLIDER, {
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
    localVue.use(Quasar, { components: { QSlider } })
    const wrapper2 = mount(QSLIDER, {
      localVue
    })
  })
})

