
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QAJAXBAR from './../components/QAJAXBAR.vue'
import { Quasar, QAjaxBar } from '~/dist/quasar.common.js'

describe('generated QAjaxBar test', () => {
  const wrapper = mountQuasar(QAJAXBAR, {
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
    localVue.use(Quasar, { components: { QAjaxBar } })
    const wrapper2 = mount(QAJAXBAR, {
      localVue
    })
  })
})

