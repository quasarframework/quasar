
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QMENU from './../components/QMENU.vue'
import { Quasar, QMenu } from 'quasar'

describe('generated QMenu test', () => {
  const wrapper = mountQuasar(QMENU, {
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
    localVue.use(Quasar, { components: { QMenu } })
    const wrapper2 = mount(QMENU, {
      localVue
    })
  })
})

