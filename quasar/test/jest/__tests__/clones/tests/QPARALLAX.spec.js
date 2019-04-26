
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QPARALLAX from './../components/QPARALLAX.vue'
import { Quasar, QParallax } from 'quasar'

describe('generated QParallax test', () => {
  const wrapper = mountQuasar(QPARALLAX, {
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
    localVue.use(Quasar, { components: { QParallax } })
    const wrapper2 = mount(QPARALLAX, {
      localVue
    })
  })
})

