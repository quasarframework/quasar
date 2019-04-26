
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QTIME from './../components/QTIME.vue'
import { Quasar, QTime } from 'quasar'

describe('generated QTime test', () => {
  const wrapper = mountQuasar(QTIME, {
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
    localVue.use(Quasar, { components: { QTime } })
    const wrapper2 = mount(QTIME, {
      localVue
    })
  })
})

