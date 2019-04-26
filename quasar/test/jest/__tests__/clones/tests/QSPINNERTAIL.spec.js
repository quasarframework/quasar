
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QSPINNERTAIL from './../components/QSPINNERTAIL.vue'
import { Quasar, QSpinnerTail } from 'quasar'

describe('generated QSpinnerTail test', () => {
  const wrapper = mountQuasar(QSPINNERTAIL, {
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
    localVue.use(Quasar, { components: { QSpinnerTail } })
    const wrapper2 = mount(QSPINNERTAIL, {
      localVue
    })
  })
})

