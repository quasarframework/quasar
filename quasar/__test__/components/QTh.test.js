import Vue from 'vue'
import QTh from '@components/QTh';

describe('QTh', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QTh)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
