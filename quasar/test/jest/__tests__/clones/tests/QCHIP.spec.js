
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QCHIP from './../components/QCHIP.vue'
import { Quasar, QChip } from 'quasar'

describe('generated QChip test', () => {
  const wrapper = mountQuasar(QCHIP, {
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
    localVue.use(Quasar, { components: { QChip } })
    const wrapper2 = mount(QCHIP, {
      localVue
    })
  })
})

