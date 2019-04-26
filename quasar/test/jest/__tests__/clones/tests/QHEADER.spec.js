
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QHEADER from './../components/QHEADER.vue'
import { Quasar, QHeader } from 'quasar'

describe('generated QHeader test', () => {
  const wrapper = mountQuasar(QHEADER, {
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
    localVue.use(Quasar, { components: { QHeader } })
    const wrapper2 = mount(QHEADER, {
      localVue
    })
  })
})

