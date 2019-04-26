
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QRATING from './../components/QRATING.vue'
import { Quasar, QRating } from 'quasar'

describe('generated QRating test', () => {
  const wrapper = mountQuasar(QRATING, {
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
    localVue.use(Quasar, { components: { QRating } })
    const wrapper2 = mount(QRATING, {
      localVue
    })
  })
})

