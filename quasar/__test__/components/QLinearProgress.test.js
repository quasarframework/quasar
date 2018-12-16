import Vue from 'vue'
import QLinearProgress from '@components/QLinearProgress';

describe('QLinearProgress', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QLinearProgress)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
