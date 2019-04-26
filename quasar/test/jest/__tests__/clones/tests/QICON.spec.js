
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QICON from './../components/QICON.vue'
import { Quasar, QIcon } from 'quasar'

describe('generated QIcon test', () => {
  const wrapper = mountQuasar(QICON, {
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
    localVue.use(Quasar, { components: { QIcon } })
    const wrapper2 = mount(QICON, {
      localVue
    })
  })
})

