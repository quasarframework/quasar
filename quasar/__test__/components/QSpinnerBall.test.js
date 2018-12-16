import Vue from 'vue'
import QSpinnerBall from '@components/QSpinnerBall';

describe('QSpinnerBall', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinnerBall)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
