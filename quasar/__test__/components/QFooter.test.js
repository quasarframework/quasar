import Vue from 'vue'
import QFooter from '@components/QFooter';

describe('QFooter', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QFooter)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
