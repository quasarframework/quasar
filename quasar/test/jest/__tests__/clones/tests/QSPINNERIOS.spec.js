
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPINNERIOS from './../components/QSPINNERIOS.vue'
import { Quasar, QSpinnerIos } from 'quasar'

describe('generated QSpinnerIos test', () => {
  const wrapper = mountQuasar(QSPINNERIOS, {
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
    localVue.use(Quasar, { components: { QSpinnerIos } })
    const wrapper2 = mount(QSPINNERIOS, {
      localVue
    })
  })
})

