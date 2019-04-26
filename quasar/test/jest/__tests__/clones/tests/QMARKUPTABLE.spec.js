
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QMARKUPTABLE from './../components/QMARKUPTABLE.vue'
import { Quasar, QMarkupTable } from 'quasar'

describe('generated QMarkupTable test', () => {
  const wrapper = mountQuasar(QMARKUPTABLE, {
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
    localVue.use(Quasar, { components: { QMarkupTable } })
    const wrapper2 = mount(QMARKUPTABLE, {
      localVue
    })
  })
})

