
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QDRAWER from './../components/QDRAWER.vue'
import { Quasar, QDrawer } from 'quasar'

describe('generated QDrawer test', () => {
  const wrapper = mountQuasar(QDRAWER, {
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
    localVue.use(Quasar, { components: { QDrawer } })
    const wrapper2 = mount(QDRAWER, {
      localVue
    })
  })
})

