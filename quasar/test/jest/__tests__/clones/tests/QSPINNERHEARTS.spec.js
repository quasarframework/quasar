
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPINNERHEARTS from './../components/QSPINNERHEARTS.vue'
import { Quasar, QSpinnerHearts } from 'quasar'

describe('generated QSpinnerHearts test', () => {
  const wrapper = mountQuasar(QSPINNERHEARTS, {
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
    localVue.use(Quasar, { components: { QSpinnerHearts } })
    const wrapper2 = mount(QSPINNERHEARTS, {
      localVue
    })
  })
})

