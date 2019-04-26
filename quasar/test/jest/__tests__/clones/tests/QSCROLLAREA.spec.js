
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QSCROLLAREA from './../components/QSCROLLAREA.vue'
import { Quasar, QScrollArea } from 'quasar'

describe('generated QScrollArea test', () => {
  const wrapper = mountQuasar(QSCROLLAREA, {
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
    localVue.use(Quasar, { components: { QScrollArea } })
    const wrapper2 = mount(QSCROLLAREA, {
      localVue
    })
  })
})

