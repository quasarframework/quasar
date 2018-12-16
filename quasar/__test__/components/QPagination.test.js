import Vue from 'vue'
import QPagination from '@components/QPagination';

describe('QPagination', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QPagination)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
