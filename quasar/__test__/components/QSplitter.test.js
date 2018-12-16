import Vue from 'vue'
import QSplitter from '@components/QSplitter';

describe('QSplitter', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSplitter)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
