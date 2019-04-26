
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QCAROUSELCONTROL from './../components/QCAROUSELCONTROL.vue'
import { Quasar, QCarouselControl } from 'quasar'

describe('generated QCarouselControl test', () => {
  const wrapper = mountQuasar(QCAROUSELCONTROL, {
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
    localVue.use(Quasar, { components: { QCarouselControl } })
    const wrapper2 = mount(QCAROUSELCONTROL, {
      localVue
    })
  })
})

