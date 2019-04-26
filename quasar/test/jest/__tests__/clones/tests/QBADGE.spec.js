
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QBADGE from './../components/QBADGE.vue'
import { Quasar, QBadge } from 'quasar'

describe('generated QBadge test', () => {
  const wrapper = mountQuasar(QBADGE, {
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
    localVue.use(Quasar, { components: { QBadge } })
    const wrapper2 = mount(QBADGE, {
      localVue
    })
  })
})

