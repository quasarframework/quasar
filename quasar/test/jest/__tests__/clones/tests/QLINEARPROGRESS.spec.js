
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QLINEARPROGRESS from './../components/QLINEARPROGRESS.vue'
import { Quasar, QLinearProgress } from 'quasar'

describe('generated QLinearProgress test', () => {
  const wrapper = mountQuasar(QLINEARPROGRESS, {
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
    localVue.use(Quasar, { components: { QLinearProgress } })
    const wrapper2 = mount(QLINEARPROGRESS, {
      localVue
    })
  })
})

