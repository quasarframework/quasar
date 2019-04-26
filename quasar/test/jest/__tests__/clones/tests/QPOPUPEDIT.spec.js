
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QPOPUPEDIT from './../components/QPOPUPEDIT.vue'
import { Quasar, QPopupEdit } from 'quasar'

describe('generated QPopupEdit test', () => {
  const wrapper = mountQuasar(QPOPUPEDIT, {
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
    localVue.use(Quasar, { components: { QPopupEdit } })
    const wrapper2 = mount(QPOPUPEDIT, {
      localVue
    })
  })
})

