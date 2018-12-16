import Vue from 'vue'
import QTab from '@components/QTab';

describe('QTab', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QTab)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
