
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QBREADCRUMBSEL from './../components/QBREADCRUMBSEL.vue'
import { Quasar, QBreadcrumbsEl } from 'quasar'

describe('generated QBreadcrumbsEl test', () => {
  const wrapper = mountQuasar(QBREADCRUMBSEL, {
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
    localVue.use(Quasar, { components: { QBreadcrumbsEl } })
    const wrapper2 = mount(QBREADCRUMBSEL, {
      localVue
    })
  })
})

