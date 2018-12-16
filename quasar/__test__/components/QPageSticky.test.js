import Vue from 'vue'
import QPageSticky from '@components/QPageSticky';

describe('QPageSticky', () => {
  it('can be mounted', () => {
    const Constructor = Vue.extend(QPageSticky)
    const vm = new Constructor().$mount()
    expect(typeof vm).toBe('object')
  })
})
