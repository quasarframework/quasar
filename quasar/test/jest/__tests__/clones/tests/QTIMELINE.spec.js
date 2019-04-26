
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QTIMELINE from './../components/QTIMELINE.vue'
import { Quasar, QTimeline } from 'quasar'

describe('generated QTimeline test', () => {
  const wrapper = mountQuasar(QTIMELINE, {
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
    localVue.use(Quasar, { components: { QTimeline } })
    const wrapper2 = mount(QTIMELINE, {
      localVue
    })
  })
})

