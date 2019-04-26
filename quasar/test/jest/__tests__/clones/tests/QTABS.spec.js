
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QTABS from './../components/QTABS.vue'
import { Quasar, QTabs } from 'quasar'

describe('generated QTabs test', () => {
  const wrapper = mountQuasar(QTABS, {
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
    localVue.use(Quasar, { components: { QTabs } })
    const wrapper2 = mount(QTABS, {
      localVue
    })
  })
})

