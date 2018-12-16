import Vue from 'vue'
import QCarousel from '@components/QCarousel';

describe('QCarousel', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QCarousel)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
