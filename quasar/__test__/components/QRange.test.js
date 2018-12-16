import Vue from 'vue'
import QRange from '@components/QRange';

describe('QRange', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QRange)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
