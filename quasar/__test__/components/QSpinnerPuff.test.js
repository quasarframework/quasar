import Vue from 'vue'
import QSpinnerPuff from '@components/QSpinnerPuff';

describe('QSpinnerPuff', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerPuff)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
