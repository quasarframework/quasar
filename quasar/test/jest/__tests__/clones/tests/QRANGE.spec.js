
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QRANGE from './../components/QRANGE.vue'
import { Quasar, QRange } from 'quasar'

describe('generated QRange test', () => {
  const wrapper = mountQuasar(QRANGE, {
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
    localVue.use(Quasar, { components: { QRange } })
    const wrapper2 = mount(QRANGE, {
      localVue
    })
  })
})

