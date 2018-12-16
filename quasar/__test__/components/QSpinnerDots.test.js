import Vue from 'vue'
import QSpinnerDots from '@components/QSpinnerDots';

describe('QSpinnerDots', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerDots)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
