
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPINNERPIE from './../components/QSPINNERPIE.vue'
import { Quasar, QSpinnerPie } from 'quasar'

describe('generated QSpinnerPie test', () => {
  const wrapper = mountQuasar(QSPINNERPIE, {
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
    localVue.use(Quasar, { components: { QSpinnerPie } })
    const wrapper2 = mount(QSPINNERPIE, {
      localVue
    })
  })
})

