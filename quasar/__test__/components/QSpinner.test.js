import Vue from 'vue'
import QSpinner from '@components/QSpinner';

describe('QSpinner', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSpinner)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
