
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QIMG from './../components/QIMG.vue'
import { Quasar, QImg } from 'quasar'

describe('generated QImg test', () => {
  const wrapper = mountQuasar(QIMG, {
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
    localVue.use(Quasar, { components: { QImg } })
    const wrapper2 = mount(QIMG, {
      localVue
    })
  })
})

