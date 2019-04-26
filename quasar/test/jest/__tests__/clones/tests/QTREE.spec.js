
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QTREE from './../components/QTREE.vue'
import { Quasar, QTree } from 'quasar'

describe('generated QTree test', () => {
  const wrapper = mountQuasar(QTREE, {
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
    localVue.use(Quasar, { components: { QTree } })
    const wrapper2 = mount(QTREE, {
      localVue
    })
  })
})

