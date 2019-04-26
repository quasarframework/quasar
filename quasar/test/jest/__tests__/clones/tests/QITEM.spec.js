
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QITEM from './../components/QITEM.vue'
import { Quasar, QItem } from 'quasar'

describe('generated QItem test', () => {
  const wrapper = mountQuasar(QITEM, {
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
    localVue.use(Quasar, { components: { QItem } })
    const wrapper2 = mount(QITEM, {
      localVue
    })
  })
})

