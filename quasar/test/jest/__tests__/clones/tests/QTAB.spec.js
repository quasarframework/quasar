
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QTAB from './../components/QTAB.vue'
import { Quasar, QTab } from 'quasar'

describe('generated QTab test', () => {
  const wrapper = mountQuasar(QTAB, {
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
    localVue.use(Quasar, { components: { QTab } })
    const wrapper2 = mount(QTAB, {
      localVue
    })
  })
})

