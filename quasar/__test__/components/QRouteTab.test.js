import Vue from 'vue'
import QRouteTab from '@components/QRouteTab';

describe('QRouteTab', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QRouteTab)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
