
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QUPLOADER from './../components/QUPLOADER.vue'
import { Quasar, QUploader } from 'quasar'

describe('generated QUploader test', () => {
  const wrapper = mountQuasar(QUPLOADER, {
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
    localVue.use(Quasar, { components: { QUploader } })
    const wrapper2 = mount(QUPLOADER, {
      localVue
    })
  })
})

