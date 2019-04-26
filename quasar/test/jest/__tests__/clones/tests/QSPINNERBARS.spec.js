
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QSPINNERBARS from './../components/QSPINNERBARS.vue'
import { Quasar, QSpinnerBars } from 'quasar'

describe('generated QSpinnerBars test', () => {
  const wrapper = mountQuasar(QSPINNERBARS, {
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
    localVue.use(Quasar, { components: { QSpinnerBars } })
    const wrapper2 = mount(QSPINNERBARS, {
      localVue
    })
  })
})

