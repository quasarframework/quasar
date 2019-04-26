
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QSPINNERBALL from './../components/QSPINNERBALL.vue'
import { Quasar, QSpinnerBall } from 'quasar'

describe('generated QSpinnerBall test', () => {
  const wrapper = mountQuasar(QSPINNERBALL, {
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
    localVue.use(Quasar, { components: { QSpinnerBall } })
    const wrapper2 = mount(QSPINNERBALL, {
      localVue
    })
  })
})

