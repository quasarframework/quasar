
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QPAGESCROLLER from './../components/QPAGESCROLLER.vue'
import { Quasar, QPageScroller } from 'quasar'

describe('generated QPageScroller test', () => {
  const wrapper = mountQuasar(QPAGESCROLLER, {
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
    localVue.use(Quasar, { components: { QPageScroller } })
    const wrapper2 = mount(QPAGESCROLLER, {
      localVue
    })
  })
})

