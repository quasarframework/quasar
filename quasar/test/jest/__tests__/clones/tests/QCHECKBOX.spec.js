
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QCHECKBOX from './../components/QCHECKBOX.vue'
import { Quasar, QCheckbox } from 'quasar'

describe('generated QCheckbox test', () => {
  const wrapper = mountQuasar(QCHECKBOX, {
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
    localVue.use(Quasar, { components: { QCheckbox } })
    const wrapper2 = mount(QCHECKBOX, {
      localVue
    })
  })
})

