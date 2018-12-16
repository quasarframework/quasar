import Vue from 'vue'
import QFab from '@components/QFab';

describe('QFab', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QFab)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
