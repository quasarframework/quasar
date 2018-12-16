import Vue from 'vue'
import QTr from '@components/QTr';

describe('QTr', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QTr)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
