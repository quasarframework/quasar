import Vue from 'vue'
import QPullToRefresh from '@components/QPullToRefresh';

describe('QPullToRefresh', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QPullToRefresh)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
