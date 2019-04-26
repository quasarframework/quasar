
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QLAYOUT from './../components/QLAYOUT.vue'
import { Quasar, QLayout } from 'quasar'

describe('generated QLayout test', () => {
  const wrapper = mountQuasar(QLAYOUT, {
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
    localVue.use(Quasar, { components: { QLayout } })
    const wrapper2 = mount(QLAYOUT, {
      localVue
    })
  })
})

