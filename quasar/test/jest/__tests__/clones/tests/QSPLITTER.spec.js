
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPLITTER from './../components/QSPLITTER.vue'
import { Quasar, QSplitter } from 'quasar'

describe('generated QSplitter test', () => {
  const wrapper = mountQuasar(QSPLITTER, {
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
    localVue.use(Quasar, { components: { QSplitter } })
    const wrapper2 = mount(QSPLITTER, {
      localVue
    })
  })
})

