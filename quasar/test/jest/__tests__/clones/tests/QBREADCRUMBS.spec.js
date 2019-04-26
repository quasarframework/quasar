
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QBREADCRUMBS from './../components/QBREADCRUMBS.vue'
import { Quasar, QBreadcrumbs } from 'quasar'

describe('generated QBreadcrumbs test', () => {
  const wrapper = mountQuasar(QBREADCRUMBS, {
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
    localVue.use(Quasar, { components: { QBreadcrumbs } })
    const wrapper2 = mount(QBREADCRUMBS, {
      localVue
    })
  })
})

