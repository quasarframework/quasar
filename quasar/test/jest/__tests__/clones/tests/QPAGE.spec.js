
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QPAGE from './../components/QPAGE.vue'
import { Quasar, QPage } from 'quasar'

describe('generated QPage test', () => {
  const wrapper = mountQuasar(QPAGE, {
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
    localVue.use(Quasar, { components: { QPage } })
    const wrapper2 = mount(QPAGE, {
      localVue
    })
  })
})

