
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QBTNDROPDOWN from './../components/QBTNDROPDOWN.vue'
import { Quasar, QBtnDropdown } from 'quasar'

describe('generated QBtnDropdown test', () => {
  const wrapper = mountQuasar(QBTNDROPDOWN, {
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
    localVue.use(Quasar, { components: { QBtnDropdown } })
    const wrapper2 = mount(QBTNDROPDOWN, {
      localVue
    })
  })
})

