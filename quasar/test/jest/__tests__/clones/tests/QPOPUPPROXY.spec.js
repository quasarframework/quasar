
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QPOPUPPROXY from './../components/QPOPUPPROXY.vue'
import { Quasar, QPopupProxy } from 'quasar'

describe('generated QPopupProxy test', () => {
  const wrapper = mountQuasar(QPOPUPPROXY, {
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
    localVue.use(Quasar, { components: { QPopupProxy } })
    const wrapper2 = mount(QPOPUPPROXY, {
      localVue
    })
  })
})

