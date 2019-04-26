
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QPAGESTICKY from './../components/QPAGESTICKY.vue'
import { Quasar, QPageSticky } from 'quasar'

describe('generated QPageSticky test', () => {
  const wrapper = mountQuasar(QPAGESTICKY, {
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
    localVue.use(Quasar, { components: { QPageSticky } })
    const wrapper2 = mount(QPAGESTICKY, {
      localVue
    })
  })
})

