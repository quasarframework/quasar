
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QFOOTER from './../components/QFOOTER.vue'
import { Quasar, QFooter } from 'quasar'

describe('generated QFooter test', () => {
  const wrapper = mountQuasar(QFOOTER, {
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
    localVue.use(Quasar, { components: { QFooter } })
    const wrapper2 = mount(QFOOTER, {
      localVue
    })
  })
})

