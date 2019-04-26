
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPINNERPUFF from './../components/QSPINNERPUFF.vue'
import { Quasar, QSpinnerPuff } from 'quasar'

describe('generated QSpinnerPuff test', () => {
  const wrapper = mountQuasar(QSPINNERPUFF, {
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
    localVue.use(Quasar, { components: { QSpinnerPuff } })
    const wrapper2 = mount(QSPINNERPUFF, {
      localVue
    })
  })
})

