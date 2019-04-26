
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QTABLE from './../components/QTABLE.vue'
import { Quasar, QTable } from 'quasar'

describe('generated QTable test', () => {
  const wrapper = mountQuasar(QTABLE, {
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
    localVue.use(Quasar, { components: { QTable } })
    const wrapper2 = mount(QTABLE, {
      localVue
    })
  })
})

