import Vue from 'vue'
import QSpinnerInfinity from '@components/QSpinnerInfinity';

describe('QSpinnerInfinity', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerInfinity)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
