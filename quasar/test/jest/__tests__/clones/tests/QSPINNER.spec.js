
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QSPINNER from './../components/QSPINNER.vue'
import { Quasar, QSpinner } from 'quasar'

describe('generated QSpinner test', () => {
  const wrapper = mountQuasar(QSPINNER, {
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
    localVue.use(Quasar, { components: { QSpinner } })
    const wrapper2 = mount(QSPINNER, {
      localVue
    })
  })
})

