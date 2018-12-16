import Vue from 'vue'
import QResizeObserver from '@components/QResizeObserver';

describe('QResizeObserver', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QResizeObserver)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
