
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSTEPPER from './../components/QSTEPPER.vue'
import { Quasar, QStepper } from 'quasar'

describe('generated QStepper test', () => {
  const wrapper = mountQuasar(QSTEPPER, {
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
    localVue.use(Quasar, { components: { QStepper } })
    const wrapper2 = mount(QSTEPPER, {
      localVue
    })
  })
})

