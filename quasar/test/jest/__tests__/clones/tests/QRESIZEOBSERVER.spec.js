
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QRESIZEOBSERVER from './../components/QRESIZEOBSERVER.vue'
import { Quasar, QResizeObserver } from 'quasar'

describe('generated QResizeObserver test', () => {
  const wrapper = mountQuasar(QRESIZEOBSERVER, {
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
    localVue.use(Quasar, { components: { QResizeObserver } })
    const wrapper2 = mount(QRESIZEOBSERVER, {
      localVue
    })
  })
})

