
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QAVATAR from './../components/QAVATAR.vue'
import { Quasar, QAvatar } from 'quasar'

describe('generated QAvatar test', () => {
  const wrapper = mountQuasar(QAVATAR, {
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
    localVue.use(Quasar, { components: { QAvatar } })
    const wrapper2 = mount(QAVATAR, {
      localVue
    })
  })
})

