import Vue from 'vue'
import QSlideTransition from '@components/QSlideTransition';

describe('QSlideTransition', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSlideTransition)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
