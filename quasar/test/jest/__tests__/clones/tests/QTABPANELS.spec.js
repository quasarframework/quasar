
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QTABPANELS from './../components/QTABPANELS.vue'
import { Quasar, QTabPanels } from 'quasar'

describe('generated QTabPanels test', () => {
  const wrapper = mountQuasar(QTABPANELS, {
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
    localVue.use(Quasar, { components: { QTabPanels } })
    const wrapper2 = mount(QTABPANELS, {
      localVue
    })
  })
})

