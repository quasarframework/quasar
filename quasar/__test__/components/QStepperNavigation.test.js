import Vue from 'vue'
import QStepperNavigation from '@components/QStepperNavigation';

describe('QStepperNavigation', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QStepperNavigation)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
