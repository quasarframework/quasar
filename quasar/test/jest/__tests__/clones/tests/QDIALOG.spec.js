
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QDIALOG from './../components/QDIALOG.vue'
import { Quasar, QDialog } from 'quasar'

describe('generated QDialog test', () => {
  const wrapper = mountQuasar(QDIALOG, {
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
    localVue.use(Quasar, { components: { QDialog } })
    const wrapper2 = mount(QDIALOG, {
      localVue
    })
  })
})

