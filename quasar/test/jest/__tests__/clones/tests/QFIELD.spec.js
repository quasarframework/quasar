
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QFIELD from './../components/QFIELD.vue'
import { Quasar, QField } from 'quasar'

describe('generated QField test', () => {
  const wrapper = mountQuasar(QFIELD, {
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
    localVue.use(Quasar, { components: { QField } })
    const wrapper2 = mount(QFIELD, {
      localVue
    })
  })
})

