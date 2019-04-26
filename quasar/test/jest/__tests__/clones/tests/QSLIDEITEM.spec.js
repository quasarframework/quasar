
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSLIDEITEM from './../components/QSLIDEITEM.vue'
import { Quasar, QSlideItem } from 'quasar'

describe('generated QSlideItem test', () => {
  const wrapper = mountQuasar(QSLIDEITEM, {
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
    localVue.use(Quasar, { components: { QSlideItem } })
    const wrapper2 = mount(QSLIDEITEM, {
      localVue
    })
  })
})

