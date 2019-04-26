
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPINNERRINGS from './../components/QSPINNERRINGS.vue'
import { Quasar, QSpinnerRings } from 'quasar'

describe('generated QSpinnerRings test', () => {
  const wrapper = mountQuasar(QSPINNERRINGS, {
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
    localVue.use(Quasar, { components: { QSpinnerRings } })
    const wrapper2 = mount(QSPINNERRINGS, {
      localVue
    })
  })
})

