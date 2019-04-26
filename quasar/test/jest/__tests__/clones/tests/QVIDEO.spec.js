
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QVIDEO from './../components/QVIDEO.vue'
import { Quasar, QVideo } from 'quasar'

describe('generated QVideo test', () => {
  const wrapper = mountQuasar(QVIDEO, {
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
    localVue.use(Quasar, { components: { QVideo } })
    const wrapper2 = mount(QVIDEO, {
      localVue
    })
  })
})

