
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPINNERGEARS from './../components/QSPINNERGEARS.vue'
import { Quasar, QSpinnerGears } from 'quasar'

describe('generated QSpinnerGears test', () => {
  const wrapper = mountQuasar(QSPINNERGEARS, {
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
    localVue.use(Quasar, { components: { QSpinnerGears } })
    const wrapper2 = mount(QSPINNERGEARS, {
      localVue
    })
  })
})

