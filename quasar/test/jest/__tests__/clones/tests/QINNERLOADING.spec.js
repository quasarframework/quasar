
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QINNERLOADING from './../components/QINNERLOADING.vue'
import { Quasar, QInnerLoading } from 'quasar'

describe('generated QInnerLoading test', () => {
  const wrapper = mountQuasar(QINNERLOADING, {
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
    localVue.use(Quasar, { components: { QInnerLoading } })
    const wrapper2 = mount(QINNERLOADING, {
      localVue
    })
  })
})

