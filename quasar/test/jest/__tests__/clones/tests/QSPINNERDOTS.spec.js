
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPINNERDOTS from './../components/QSPINNERDOTS.vue'
import { Quasar, QSpinnerDots } from 'quasar'

describe('generated QSpinnerDots test', () => {
  const wrapper = mountQuasar(QSPINNERDOTS, {
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
    localVue.use(Quasar, { components: { QSpinnerDots } })
    const wrapper2 = mount(QSPINNERDOTS, {
      localVue
    })
  })
})

