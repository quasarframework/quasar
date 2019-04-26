
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QCAROUSEL from './../components/QCAROUSEL.vue'
import { Quasar, QCarousel } from 'quasar'

describe('generated QCarousel test', () => {
  const wrapper = mountQuasar(QCAROUSEL, {
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
    localVue.use(Quasar, { components: { QCarousel } })
    const wrapper2 = mount(QCAROUSEL, {
      localVue
    })
  })
})

