
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QOPTIONGROUP from './../components/QOPTIONGROUP.vue'
import { Quasar, QOptionGroup } from 'quasar'

describe('generated QOptionGroup test', () => {
  const wrapper = mountQuasar(QOPTIONGROUP, {
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
    localVue.use(Quasar, { components: { QOptionGroup } })
    const wrapper2 = mount(QOPTIONGROUP, {
      localVue
    })
  })
})

