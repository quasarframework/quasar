
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QBANNER from './../components/QBANNER.vue'
import { Quasar, QBanner } from 'quasar'

describe('generated QBanner test', () => {
  const wrapper = mountQuasar(QBANNER, {
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
    localVue.use(Quasar, { components: { QBanner } })
    const wrapper2 = mount(QBANNER, {
      localVue
    })
  })
})

