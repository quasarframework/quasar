
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QSLIDETRANSITION from './../components/QSLIDETRANSITION.vue'
import { Quasar, QSlideTransition } from 'quasar'

describe('generated QSlideTransition test', () => {
  const wrapper = mountQuasar(QSLIDETRANSITION, {
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
    localVue.use(Quasar, { components: { QSlideTransition } })
    const wrapper2 = mount(QSLIDETRANSITION, {
      localVue
    })
  })
})

