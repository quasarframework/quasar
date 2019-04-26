
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QDATE from './../components/QDATE.vue'
import { Quasar, QDate } from 'quasar'

describe('generated QDate test', () => {
  const wrapper = mountQuasar(QDATE, {
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
    localVue.use(Quasar, { components: { QDate } })
    const wrapper2 = mount(QDATE, {
      localVue
    })
  })
})

