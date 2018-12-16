import Vue from 'vue'
import QSpinnerCircles from '@components/QSpinnerCircles';

describe('QSpinnerCircles', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerCircles)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
