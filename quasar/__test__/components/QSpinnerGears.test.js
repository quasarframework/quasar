import Vue from 'vue'
import QSpinnerGears from '@components/QSpinnerGears';

describe('QSpinnerGears', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerGears)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
