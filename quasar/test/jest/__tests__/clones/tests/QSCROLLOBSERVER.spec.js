
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QSCROLLOBSERVER from './../components/QSCROLLOBSERVER.vue'
import { Quasar, QScrollObserver } from 'quasar'

describe('generated QScrollObserver test', () => {
  const wrapper = mountQuasar(QSCROLLOBSERVER, {
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
    localVue.use(Quasar, { components: { QScrollObserver } })
    const wrapper2 = mount(QSCROLLOBSERVER, {
      localVue
    })
  })
})

