
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QPAGECONTAINER from './../components/QPAGECONTAINER.vue'
import { Quasar, QPageContainer } from 'quasar'

describe('generated QPageContainer test', () => {
  const wrapper = mountQuasar(QPAGECONTAINER, {
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
    localVue.use(Quasar, { components: { QPageContainer } })
    const wrapper2 = mount(QPAGECONTAINER, {
      localVue
    })
  })
})

