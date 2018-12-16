import Vue from 'vue'
import QTabs from '@components/QTabs';

describe('QTabs', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QTabs)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
