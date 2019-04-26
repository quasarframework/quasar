
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSTEP from './../components/QSTEP.vue'
import { Quasar, QStep } from 'quasar'

describe('generated QStep test', () => {
  const wrapper = mountQuasar(QSTEP, {
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
    localVue.use(Quasar, { components: { QStep } })
    const wrapper2 = mount(QSTEP, {
      localVue
    })
  })
})

