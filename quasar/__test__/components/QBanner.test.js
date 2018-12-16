import Vue from 'vue'
import QBanner from '@components/QBanner';

describe('QBanner', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QBanner)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
