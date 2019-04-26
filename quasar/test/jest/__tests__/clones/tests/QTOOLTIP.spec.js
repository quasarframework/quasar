
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QTOOLTIP from './../components/QTOOLTIP.vue'
import { Quasar, QTooltip } from 'quasar'

describe('generated QTooltip test', () => {
  const wrapper = mountQuasar(QTOOLTIP, {
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
    localVue.use(Quasar, { components: { QTooltip } })
    const wrapper2 = mount(QTOOLTIP, {
      localVue
    })
  })
})

