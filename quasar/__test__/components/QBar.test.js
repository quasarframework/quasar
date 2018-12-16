import Vue from 'vue'
import QBar from '@components/QBar';

describe('QBar', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QBar)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
