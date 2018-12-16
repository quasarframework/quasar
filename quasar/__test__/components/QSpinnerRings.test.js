import Vue from 'vue'
import QSpinnerRings from '@components/QSpinnerRings';

describe('QSpinnerRings', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerRings)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
