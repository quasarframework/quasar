import Vue from 'vue'
import QStepper from '@components/QStepper';

describe('QStepper', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QStepper)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
