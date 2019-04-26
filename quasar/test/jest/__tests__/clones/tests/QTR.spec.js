
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QTR from './../components/QTR.vue'
import { Quasar, QTr } from 'quasar'

describe('generated QTr test', () => {
  const wrapper = mountQuasar(QTR, {
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
    localVue.use(Quasar, { components: { QTr } })
    const wrapper2 = mount(QTR, {
      localVue
    })
  })
})

