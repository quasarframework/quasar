
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QTABPANEL from './../components/QTABPANEL.vue'
import { Quasar, QTabPanel } from 'quasar'

describe('generated QTabPanel test', () => {
  const wrapper = mountQuasar(QTABPANEL, {
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
    localVue.use(Quasar, { components: { QTabPanel } })
    const wrapper2 = mount(QTABPANEL, {
      localVue
    })
  })
})

