
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QPULLTOREFRESH from './../components/QPULLTOREFRESH.vue'
import { Quasar, QPullToRefresh } from 'quasar'

describe('generated QPullToRefresh test', () => {
  const wrapper = mountQuasar(QPULLTOREFRESH, {
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
    localVue.use(Quasar, { components: { QPullToRefresh } })
    const wrapper2 = mount(QPULLTOREFRESH, {
      localVue
    })
  })
})

