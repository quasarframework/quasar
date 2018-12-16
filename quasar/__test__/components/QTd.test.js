import Vue from 'vue'
import QTd from '@components/QTd';

describe('QTd', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QTd)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
