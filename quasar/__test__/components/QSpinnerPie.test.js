import Vue from 'vue'
import QSpinnerPie from '@components/QSpinnerPie';

describe('QSpinnerPie', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerPie)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
