
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QTOGGLE from './../components/QTOGGLE.vue'
import { Quasar, QToggle } from 'quasar'

describe('generated QToggle test', () => {
  const wrapper = mountQuasar(QTOGGLE, {
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
    localVue.use(Quasar, { components: { QToggle } })
    const wrapper2 = mount(QTOGGLE, {
      localVue
    })
  })
})

