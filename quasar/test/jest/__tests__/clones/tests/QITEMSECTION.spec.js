
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QITEMSECTION from './../components/QITEMSECTION.vue'
import { Quasar, QItemSection } from 'quasar'

describe('generated QItemSection test', () => {
  const wrapper = mountQuasar(QITEMSECTION, {
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
    localVue.use(Quasar, { components: { QItemSection } })
    const wrapper2 = mount(QITEMSECTION, {
      localVue
    })
  })
})

