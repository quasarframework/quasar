
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QLIST from './../components/QLIST.vue'
import { Quasar, QList } from 'quasar'

describe('generated QList test', () => {
  const wrapper = mountQuasar(QLIST, {
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
    localVue.use(Quasar, { components: { QList } })
    const wrapper2 = mount(QLIST, {
      localVue
    })
  })
})

