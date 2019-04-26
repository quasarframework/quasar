
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPINNERFACEBOOK from './../components/QSPINNERFACEBOOK.vue'
import { Quasar, QSpinnerFacebook } from 'quasar'

describe('generated QSpinnerFacebook test', () => {
  const wrapper = mountQuasar(QSPINNERFACEBOOK, {
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
    localVue.use(Quasar, { components: { QSpinnerFacebook } })
    const wrapper2 = mount(QSPINNERFACEBOOK, {
      localVue
    })
  })
})

