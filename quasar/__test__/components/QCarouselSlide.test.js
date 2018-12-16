import Vue from 'vue'
import QCarouselSlide from '@components/QCarouselSlide';

describe('QCarouselSlide', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QCarouselSlide)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
