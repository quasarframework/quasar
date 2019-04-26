
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QPAGINATION from './../components/QPAGINATION.vue'
import { Quasar, QPagination } from 'quasar'

describe('generated QPagination test', () => {
  const wrapper = mountQuasar(QPAGINATION, {
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
    localVue.use(Quasar, { components: { QPagination } })
    const wrapper2 = mount(QPAGINATION, {
      localVue
    })
  })
})

