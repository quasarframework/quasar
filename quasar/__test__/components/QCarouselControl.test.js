import Vue from 'vue'
import QCarouselControl from '@components/QCarouselControl';

describe('QCarouselControl', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QCarouselControl)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
