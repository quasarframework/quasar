
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QTOOLBARTITLE from './../components/QTOOLBARTITLE.vue'
import { Quasar, QToolbarTitle } from 'quasar'

describe('generated QToolbarTitle test', () => {
  const wrapper = mountQuasar(QTOOLBARTITLE, {
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
    localVue.use(Quasar, { components: { QToolbarTitle } })
    const wrapper2 = mount(QTOOLBARTITLE, {
      localVue
    })
  })
})

