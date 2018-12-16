import Vue from 'vue'
import QParallax from '@components/QParallax';

describe('QParallax', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QParallax)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
