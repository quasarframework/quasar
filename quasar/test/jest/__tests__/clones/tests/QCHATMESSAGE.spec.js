
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QCHATMESSAGE from './../components/QCHATMESSAGE.vue'
import { Quasar, QChatMessage } from 'quasar'

describe('generated QChatMessage test', () => {
  const wrapper = mountQuasar(QCHATMESSAGE, {
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
    localVue.use(Quasar, { components: { QChatMessage } })
    const wrapper2 = mount(QCHATMESSAGE, {
      localVue
    })
  })
})

