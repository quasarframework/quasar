import Vue from 'vue'
import QInfiniteScroll from '@components/QInfiniteScroll';

describe('QInfiniteScroll', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QInfiniteScroll)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
