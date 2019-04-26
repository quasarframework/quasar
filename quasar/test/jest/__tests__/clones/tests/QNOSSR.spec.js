
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QNOSSR from './../components/QNOSSR.vue'
import { Quasar, QNoSsr } from 'quasar'

describe('generated QNoSsr test', () => {
  const wrapper = mountQuasar(QNOSSR, {
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
    localVue.use(Quasar, { components: { QNoSsr } })
    const wrapper2 = mount(QNOSSR, {
      localVue
    })
  })
})

