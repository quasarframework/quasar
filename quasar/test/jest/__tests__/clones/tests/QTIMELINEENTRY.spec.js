
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QTIMELINEENTRY from './../components/QTIMELINEENTRY.vue'
import { Quasar, QTimelineEntry } from 'quasar'

describe('generated QTimelineEntry test', () => {
  const wrapper = mountQuasar(QTIMELINEENTRY, {
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
    localVue.use(Quasar, { components: { QTimelineEntry } })
    const wrapper2 = mount(QTIMELINEENTRY, {
      localVue
    })
  })
})

