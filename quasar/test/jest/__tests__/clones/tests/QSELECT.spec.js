
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QSELECT from './../components/QSELECT.vue'
import { Quasar, QSelect } from 'quasar'

describe('generated QSelect test', () => {
  const wrapper = mountQuasar(QSELECT, {
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
    localVue.use(Quasar, { components: { QSelect } })
    const wrapper2 = mount(QSELECT, {
      localVue
    })
  })
})

