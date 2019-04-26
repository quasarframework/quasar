
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QSPINNERHOURGLASS from './../components/QSPINNERHOURGLASS.vue'
import { Quasar, QSpinnerHourglass } from 'quasar'

describe('generated QSpinnerHourglass test', () => {
  const wrapper = mountQuasar(QSPINNERHOURGLASS, {
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
    localVue.use(Quasar, { components: { QSpinnerHourglass } })
    const wrapper2 = mount(QSPINNERHOURGLASS, {
      localVue
    })
  })
})

