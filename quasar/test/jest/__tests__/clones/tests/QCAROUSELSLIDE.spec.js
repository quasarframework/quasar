
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QCAROUSELSLIDE from './../components/QCAROUSELSLIDE.vue'
import { Quasar, QCarouselSlide } from 'quasar'

describe('generated QCarouselSlide test', () => {
  const wrapper = mountQuasar(QCAROUSELSLIDE, {
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
    localVue.use(Quasar, { components: { QCarouselSlide } })
    const wrapper2 = mount(QCAROUSELSLIDE, {
      localVue
    })
  })
})

