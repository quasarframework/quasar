import Vue from 'vue'
import QSpinnerBars from '@components/QSpinnerBars';

describe('QSpinnerBars', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerBars)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
