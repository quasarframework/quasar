
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QKNOB from './../components/QKNOB.vue'
import { Quasar, QKnob } from 'quasar'

describe('generated QKnob test', () => {
  const wrapper = mountQuasar(QKNOB, {
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
    localVue.use(Quasar, { components: { QKnob } })
    const wrapper2 = mount(QKNOB, {
      localVue
    })
  })
})

