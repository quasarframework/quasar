
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QSPINNERCOMMENT from './../components/QSPINNERCOMMENT.vue'
import { Quasar, QSpinnerComment } from 'quasar'

describe('generated QSpinnerComment test', () => {
  const wrapper = mountQuasar(QSPINNERCOMMENT, {
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
    localVue.use(Quasar, { components: { QSpinnerComment } })
    const wrapper2 = mount(QSPINNERCOMMENT, {
      localVue
    })
  })
})

