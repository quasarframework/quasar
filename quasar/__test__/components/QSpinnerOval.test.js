import Vue from 'vue'
import QSpinnerOval from '@components/QSpinnerOval';

describe('QSpinnerOval', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerOval)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
