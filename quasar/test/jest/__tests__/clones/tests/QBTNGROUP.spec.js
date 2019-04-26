
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QBTNGROUP from './../components/QBTNGROUP.vue'
import { Quasar, QBtnGroup } from 'quasar'

describe('generated QBtnGroup test', () => {
  const wrapper = mountQuasar(QBTNGROUP, {
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
    localVue.use(Quasar, { components: { QBtnGroup } })
    const wrapper2 = mount(QBTNGROUP, {
      localVue
    })
  })
})

