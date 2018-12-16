import Vue from 'vue'
import QInnerLoading from '@components/QInnerLoading';

describe('QInnerLoading', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QInnerLoading)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
