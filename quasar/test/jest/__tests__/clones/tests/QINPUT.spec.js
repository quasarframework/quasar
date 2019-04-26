
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QINPUT from './../components/QINPUT.vue'
import { Quasar, QInput } from 'quasar'

describe('generated QInput test', () => {
  const wrapper = mountQuasar(QINPUT, {
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
    localVue.use(Quasar, { components: { QInput } })
    const wrapper2 = mount(QINPUT, {
      localVue
    })
  })
})

