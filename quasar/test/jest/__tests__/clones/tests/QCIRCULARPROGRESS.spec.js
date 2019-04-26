
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import QCIRCULARPROGRESS from './../components/QCIRCULARPROGRESS.vue'
import { Quasar, QCircularProgress } from 'quasar'

describe('generated QCircularProgress test', () => {
  const wrapper = mountQuasar(QCIRCULARPROGRESS, {
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
    localVue.use(Quasar, { components: { QCircularProgress } })
    const wrapper2 = mount(QCIRCULARPROGRESS, {
      localVue
    })
  })
})

