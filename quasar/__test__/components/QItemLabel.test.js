import Vue from 'vue'
import QItemLabel from '@components/QItemLabel';

describe('QItemLabel', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QItemLabel)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
