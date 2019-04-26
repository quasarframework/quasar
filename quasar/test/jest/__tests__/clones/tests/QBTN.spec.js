
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QBTN from './../components/QBTN.vue'
import { Quasar, QBtn } from 'quasar'

describe('generated QBtn test', () => {
  const wrapper = mountQuasar(QBTN, {
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
    localVue.use(Quasar, { components: { QBtn } })
    const wrapper2 = mount(QBTN, {
      localVue
    })
  })
})

