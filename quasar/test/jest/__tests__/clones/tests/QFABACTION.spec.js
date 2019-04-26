
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QFABACTION from './../components/QFABACTION.vue'
import { Quasar, QFabAction } from 'quasar'

describe('generated QFabAction test', () => {
  const wrapper = mountQuasar(QFABACTION, {
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
    localVue.use(Quasar, { components: { QFabAction } })
    const wrapper2 = mount(QFABACTION, {
      localVue
    })
  })
})

