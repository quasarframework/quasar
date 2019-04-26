
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QINFINITESCROLL from './../components/QINFINITESCROLL.vue'
import { Quasar, QInfiniteScroll } from 'quasar'

describe('generated QInfiniteScroll test', () => {
  const wrapper = mountQuasar(QINFINITESCROLL, {
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
    localVue.use(Quasar, { components: { QInfiniteScroll } })
    const wrapper2 = mount(QINFINITESCROLL, {
      localVue
    })
  })
})

