
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QBTNTOGGLE from './../components/QBTNTOGGLE.vue'
import { Quasar, QBtnToggle } from 'quasar'

describe('generated QBtnToggle test', () => {
  const wrapper = mountQuasar(QBTNTOGGLE, {
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
    localVue.use(Quasar, { components: { QBtnToggle } })
    const wrapper2 = mount(QBTNTOGGLE, {
      localVue
    })
  })
})

