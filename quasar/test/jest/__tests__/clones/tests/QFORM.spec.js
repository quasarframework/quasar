
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QFORM from './../components/QFORM.vue'
import { Quasar, QForm } from 'quasar'

describe('generated QForm test', () => {
  const wrapper = mountQuasar(QFORM, {
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
    localVue.use(Quasar, { components: { QForm } })
    const wrapper2 = mount(QFORM, {
      localVue
    })
  })
})

