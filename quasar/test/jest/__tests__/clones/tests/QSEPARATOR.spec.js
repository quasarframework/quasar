
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSEPARATOR from './../components/QSEPARATOR.vue'
import { Quasar, QSeparator } from 'quasar'

describe('generated QSeparator test', () => {
  const wrapper = mountQuasar(QSEPARATOR, {
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
    localVue.use(Quasar, { components: { QSeparator } })
    const wrapper2 = mount(QSEPARATOR, {
      localVue
    })
  })
})

