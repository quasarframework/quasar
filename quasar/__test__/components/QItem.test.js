import Vue from 'vue'
import QItem from '@components/QItem';

describe('QItem', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QItem)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
