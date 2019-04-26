
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPINNERINFINITY from './../components/QSPINNERINFINITY.vue'
import { Quasar, QSpinnerInfinity } from 'quasar'

describe('generated QSpinnerInfinity test', () => {
  const wrapper = mountQuasar(QSPINNERINFINITY, {
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
    localVue.use(Quasar, { components: { QSpinnerInfinity } })
    const wrapper2 = mount(QSPINNERINFINITY, {
      localVue
    })
  })
})

