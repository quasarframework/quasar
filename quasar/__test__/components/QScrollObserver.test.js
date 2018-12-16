import Vue from 'vue'
import QScrollObserver from '@components/QScrollObserver';

describe('QScrollObserver', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QScrollObserver)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
