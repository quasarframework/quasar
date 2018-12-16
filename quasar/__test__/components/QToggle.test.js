import Vue from 'vue'
import QToggle from '@components/QToggle';

describe('QToggle', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QToggle)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
