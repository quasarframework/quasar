
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QROUTETAB from './../components/QROUTETAB.vue'
import { Quasar, QRouteTab } from 'quasar'

describe('generated QRouteTab test', () => {
  const wrapper = mountQuasar(QROUTETAB, {
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
    localVue.use(Quasar, { components: { QRouteTab } })
    const wrapper2 = mount(QROUTETAB, {
      localVue
    })
  })
})

