
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPINNEROVAL from './../components/QSPINNEROVAL.vue'
import { Quasar, QSpinnerOval } from 'quasar'

describe('generated QSpinnerOval test', () => {
  const wrapper = mountQuasar(QSPINNEROVAL, {
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
    localVue.use(Quasar, { components: { QSpinnerOval } })
    const wrapper2 = mount(QSPINNEROVAL, {
      localVue
    })
  })
})

