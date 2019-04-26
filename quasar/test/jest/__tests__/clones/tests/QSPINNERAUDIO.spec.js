
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import { mountQuasar } from '~/test/jest/utils'
import QSPINNERAUDIO from './../components/QSPINNERAUDIO.vue'
import { Quasar, QSpinnerAudio } from 'quasar'

describe('generated QSpinnerAudio test', () => {
  const wrapper = mountQuasar(QSPINNERAUDIO, {
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
    localVue.use(Quasar, { components: { QSpinnerAudio } })
    const wrapper2 = mount(QSPINNERAUDIO, {
      localVue
    })
  })
})

