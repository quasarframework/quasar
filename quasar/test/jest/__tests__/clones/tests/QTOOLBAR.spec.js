
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QTOOLBAR from './../components/QTOOLBAR.vue'
import { Quasar, QToolbar } from 'quasar'

describe('generated QToolbar test', () => {
  const wrapper = mountQuasar(QTOOLBAR, {
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
    localVue.use(Quasar, { components: { QToolbar } })
    const wrapper2 = mount(QTOOLBAR, {
      localVue
    })
  })
})

