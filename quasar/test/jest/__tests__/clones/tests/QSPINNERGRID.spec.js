
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPINNERGRID from './../components/QSPINNERGRID.vue'
import { Quasar, QSpinnerGrid } from 'quasar'

describe('generated QSpinnerGrid test', () => {
  const wrapper = mountQuasar(QSPINNERGRID, {
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
    localVue.use(Quasar, { components: { QSpinnerGrid } })
    const wrapper2 = mount(QSPINNERGRID, {
      localVue
    })
  })
})

