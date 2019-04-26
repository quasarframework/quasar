
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QCARD from './../components/QCARD.vue'
import { Quasar, QCard } from 'quasar'

describe('generated QCard test', () => {
  const wrapper = mountQuasar(QCARD, {
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
    localVue.use(Quasar, { components: { QCard } })
    const wrapper2 = mount(QCARD, {
      localVue
    })
  })
})

