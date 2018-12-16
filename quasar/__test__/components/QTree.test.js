import Vue from 'vue'
import QTree from '@components/QTree';

describe('QTree', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QTree)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
