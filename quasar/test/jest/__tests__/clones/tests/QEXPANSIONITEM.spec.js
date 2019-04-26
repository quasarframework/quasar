
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QEXPANSIONITEM from './../components/QEXPANSIONITEM.vue'
import { Quasar, QExpansionItem } from 'quasar'

describe('generated QExpansionItem test', () => {
  const wrapper = mountQuasar(QEXPANSIONITEM, {
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
    localVue.use(Quasar, { components: { QExpansionItem } })
    const wrapper2 = mount(QEXPANSIONITEM, {
      localVue
    })
  })
})

