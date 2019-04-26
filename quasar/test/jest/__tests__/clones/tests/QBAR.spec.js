
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QBAR from './../components/QBAR.vue'
import { Quasar, QBar } from 'quasar'

describe('generated QBar test', () => {
  const wrapper = mountQuasar(QBAR, {
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
    localVue.use(Quasar, { components: { QBar } })
    const wrapper2 = mount(QBAR, {
      localVue
    })
  })
})

