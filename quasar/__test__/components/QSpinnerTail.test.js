import Vue from 'vue'
import QSpinnerTail from '@components/QSpinnerTail';

describe('QSpinnerTail', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerTail)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
