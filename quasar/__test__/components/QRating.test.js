import Vue from 'vue'
import QRating from '@components/QRating';

describe('QRating', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QRating)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
