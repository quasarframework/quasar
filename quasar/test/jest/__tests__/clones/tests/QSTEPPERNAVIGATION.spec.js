
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QSTEPPERNAVIGATION from './../components/QSTEPPERNAVIGATION.vue'
import { Quasar, QStepperNavigation } from 'quasar'

describe('generated QStepperNavigation test', () => {
  const wrapper = mountQuasar(QSTEPPERNAVIGATION, {
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
    localVue.use(Quasar, { components: { QStepperNavigation } })
    const wrapper2 = mount(QSTEPPERNAVIGATION, {
      localVue
    })
  })
})

