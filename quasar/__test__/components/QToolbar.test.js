import Vue from 'vue'
import QToolbar from '@components/QToolbar';

describe('QToolbar', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QToolbar)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
