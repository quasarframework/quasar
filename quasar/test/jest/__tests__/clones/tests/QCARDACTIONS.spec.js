
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QCARDACTIONS from './../components/QCARDACTIONS.vue'
import { Quasar, QCardActions } from 'quasar'

describe('generated QCardActions test', () => {
  const wrapper = mountQuasar(QCARDACTIONS, {
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
    localVue.use(Quasar, { components: { QCardActions } })
    const wrapper2 = mount(QCARDACTIONS, {
      localVue
    })
  })
})

