
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QITEMLABEL from './../components/QITEMLABEL.vue'
import { Quasar, QItemLabel } from 'quasar'

describe('generated QItemLabel test', () => {
  const wrapper = mountQuasar(QITEMLABEL, {
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
    localVue.use(Quasar, { components: { QItemLabel } })
    const wrapper2 = mount(QITEMLABEL, {
      localVue
    })
  })
})

