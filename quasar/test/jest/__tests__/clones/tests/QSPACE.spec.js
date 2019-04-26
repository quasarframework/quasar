
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPACE from './../components/QSPACE.vue'
import { Quasar, QSpace } from 'quasar'

describe('generated QSpace test', () => {
  const wrapper = mountQuasar(QSPACE, {
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
    localVue.use(Quasar, { components: { QSpace } })
    const wrapper2 = mount(QSPACE, {
      localVue
    })
  })
})

