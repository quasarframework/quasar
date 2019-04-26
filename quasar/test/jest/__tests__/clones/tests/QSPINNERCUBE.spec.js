
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPINNERCUBE from './../components/QSPINNERCUBE.vue'
import { Quasar, QSpinnerCube } from 'quasar'

describe('generated QSpinnerCube test', () => {
  const wrapper = mountQuasar(QSPINNERCUBE, {
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
    localVue.use(Quasar, { components: { QSpinnerCube } })
    const wrapper2 = mount(QSPINNERCUBE, {
      localVue
    })
  })
})

