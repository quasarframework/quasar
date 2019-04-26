
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QEDITOR from './../components/QEDITOR.vue'
import { Quasar, QEditor } from 'quasar'

describe('generated QEditor test', () => {
  const wrapper = mountQuasar(QEDITOR, {
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
    localVue.use(Quasar, { components: { QEditor } })
    const wrapper2 = mount(QEDITOR, {
      localVue
    })
  })
})

