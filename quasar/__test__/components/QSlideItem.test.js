import Vue from 'vue'
import QSlideItem from '@components/QSlideItem';

describe('QSlideItem', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QSlideItem)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
